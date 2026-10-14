/**
 * Chart primitives mapped onto `@mantine/charts`.
 *
 * The SDK describes charts as parallel `categories` + `series[]` arrays (or a
 * flat `data` array for pie); Mantine wants an array of row objects plus a
 * series descriptor. We reshape here and map `tone` -> color.
 */
import type {
  ChartReferenceLineProps,
  LineChartCurveType,
} from '@mantine/charts'
import {
    AreaChart,
    ChartLegend,
    DonutChart,
    BarChart as MantineBarChart,
    LineChart as MantineLineChart,
    PieChart as MantinePieChart,
} from '@mantine/charts'
import { useState } from 'react'
import { toneHex } from './theme'
import { useHostTheme } from './use-tokens'

export type {
    BarChartProps,
    ChartDataPoint,
    ChartReferenceLine,
    ChartSeries,
    ChartTone,
    LineChartProps,
    PieChartProps
} from '../vendor/canvas-sdk/chart-primitives.js'

import type {
    BarChartProps,
    ChartReferenceLine,
    ChartSeries,
    ChartTone,
    LineChartProps,
    PieChartProps,
} from '../vendor/canvas-sdk/chart-primitives.js'

type ValueAxisProps = Pick<
  BarChartProps,
  'beginAtZero' | 'yMin' | 'yMax' | 'referenceLines'
>;

/** Mantine cartesian charts default legend to top; IDE places it below, centered. */
const CHART_LEGEND_PROPS = {
  verticalAlign: 'bottom' as const,
  align: 'center' as const,
};

const CHART_LEGEND_STYLES = {
  legend: { justifyContent: 'center' },
} as const;

function useSeriesColor(): (
  tone: ChartTone | undefined,
  index: number,
) => string {
  const theme = useHostTheme();
  const sequence = theme.chart.sequence;
  return (tone, index) =>
    tone ? toneHex[tone] : sequence[index % sequence.length];
}

/** IDE charts use host foreground for axes/legends, not Mantine `dimmed`. */
function useChartColorProps(): { textColor: string; barLabelColor: string } {
  const theme = useHostTheme();
  const text = theme.text.primary;
  return { textColor: text, barLabelColor: text };
}

/**
 * Fork-only export (not in IDE `index.d.ts`); keeps chart data shaping stable for
 * Mantine — listed under “fork-only” in `pnpm run check:sdk-exports`.
 */
export function reshapeLineChartData(
  categories: string[],
  series: ChartSeries[],
): Record<string, string | number>[] {
  return categories.map((category, index) => {
    const row: Record<string, string | number> = { category };
    for (const s of series) {
      row[s.name] = s.data[index] ?? 0;
    }
    return row;
  });
}

function toMantineSeries(
  series: ChartSeries[],
  seriesColor: (tone: ChartTone | undefined, index: number) => string,
) {
  return series.map((s, index) => ({
    name: s.name,
    color: seriesColor(s.tone, index),
  }));
}

function valueFormatter(valueSuffix?: string, valuePrefix?: string) {
  return (value: number) => `${valuePrefix ?? ''}${value}${valueSuffix ?? ''}`;
}

function mantineReferenceLines(
  lines: ChartReferenceLine[] | undefined,
  horizontal: boolean,
): ChartReferenceLineProps[] | undefined {
  if (!lines?.length) {
    return undefined;
  }
  return lines.map((line) => ({
    ...(horizontal ? { x: line.value } : { y: line.value }),
    label: line.label,
    color: line.tone ? toneHex[line.tone] : toneHex.neutral,
  }));
}

type AxisChartProps = {
  yAxisProps?: { domain: [number | string, number | string] };
  xAxisProps?: { domain: [number | string, number | string] };
  referenceLines?: ChartReferenceLineProps[];
};

function valueAxisChartProps(
  opts: ValueAxisProps & {
    horizontal?: boolean;
    stacked?: boolean;
    normalized?: boolean;
  },
): AxisChartProps {
  const ref = mantineReferenceLines(opts.referenceLines, !!opts.horizontal);
  if (opts.stacked || opts.normalized) {
    return { referenceLines: ref };
  }
  const beginAtZero = opts.beginAtZero !== false;
  const domain: [number | string, number | string] = [
    opts.yMin ?? (beginAtZero ? 0 : 'auto'),
    opts.yMax ?? 'auto',
  ];
  if (opts.horizontal) {
    return { xAxisProps: { domain }, referenceLines: ref };
  }
  return { yAxisProps: { domain }, referenceLines: ref };
}

function defaultShowBarValues(
  showValues: boolean | undefined,
  series: ChartSeries[],
  categories: string[],
): boolean {
  if (showValues !== undefined) {
    return showValues;
  }
  return series.length === 1 && categories.length <= 8;
}

const HORIZONTAL_CATEGORY_LABEL_MAX = 14;

function truncateCategoryAxisLabel(text: string): string {
  if (text.length <= HORIZONTAL_CATEGORY_LABEL_MAX) {
    return text;
  }
  return `${text.slice(0, HORIZONTAL_CATEGORY_LABEL_MAX - 1)}…`;
}

function horizontalCategoryAxisTick(props: {
  x?: string | number;
  y?: string | number;
  payload?: { value?: string | number };
}) {
  const x = typeof props.x === 'number' ? props.x : Number(props.x) || 0;
  const y = typeof props.y === 'number' ? props.y : Number(props.y) || 0;
  const full = String(props.payload?.value ?? '');
  const display = truncateCategoryAxisLabel(full);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-10}
        y={0}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        fontSize={12}
      >
        <title>{full}</title>
        {display}
      </text>
    </g>
  );
}

function barValueLabelProps(barLabelColor: string) {
  return {
    fontWeight: 700,
    fill: barLabelColor,
  };
}

function horizontalBarProps() {
  return {
    yAxisProps: {
      tick: horizontalCategoryAxisTick,
      width: 96,
    },
    barChartProps: {
      margin: { right: 32 },
    },
  };
}

/** Room above vertical bars so value labels are not clipped. */
function verticalBarLabelProps() {
  return {
    barChartProps: {
      margin: { top: 22 },
    },
  };
}

/** Shim-only: IDE line/area charts use straight segments unless `smooth` is set. */
export type LineChartShimProps = LineChartProps & { smooth?: boolean };

export function LineChart({
  categories,
  series,
  height = 240,
  fill,
  valueSuffix,
  valuePrefix,
  showValues,
  showHoverGuide = true,
  beginAtZero,
  yMin,
  yMax,
  referenceLines,
  style,
  smooth,
}: LineChartShimProps) {
  const seriesColor = useSeriesColor();
  const chartColors = useChartColorProps();
  const data = reshapeLineChartData(categories, series);
  const mantineSeries = toMantineSeries(series, seriesColor);
  const axis = valueAxisChartProps({
    beginAtZero,
    yMin,
    yMax,
    referenceLines,
    horizontal: false,
  });
  const common = {
    h: height,
    data,
    dataKey: 'category',
    series: mantineSeries,
    curveType: (smooth ? 'monotone' : 'linear') as LineChartCurveType,
    withLegend: series.length > 1,
    legendProps: CHART_LEGEND_PROPS,
    valueFormatter: valueFormatter(valueSuffix, valuePrefix),
    withPointLabels: showValues ?? categories.length <= 20,
    tooltipProps: showHoverGuide ? undefined : { cursor: false },
    styles: {
      ...CHART_LEGEND_STYLES,
      legendItemName: { color: chartColors.textColor },
    },
    ...chartColors,
    ...axis,
    style,
  };
  return fill ? <AreaChart {...common} /> : <MantineLineChart {...common} />;
}

export function BarChart({
  categories,
  series,
  height = 240,
  stacked,
  horizontal,
  normalized,
  valueSuffix,
  valuePrefix,
  showValues,
  beginAtZero,
  yMin,
  yMax,
  referenceLines,
  style,
}: BarChartProps) {
  const seriesColor = useSeriesColor();
  const chartColors = useChartColorProps();
  const data = reshapeLineChartData(categories, series);
  const type = normalized ? 'percent' : stacked ? 'stacked' : 'default';
  const axis = valueAxisChartProps({
    beginAtZero,
    yMin,
    yMax,
    referenceLines,
    horizontal,
    stacked,
    normalized,
  });
  const withBarValueLabel =
    !stacked &&
    !normalized &&
    defaultShowBarValues(showValues, series, categories);
  return (
    <MantineBarChart
      h={height}
      data={data}
      dataKey="category"
      series={toMantineSeries(series, seriesColor)}
      type={type}
      orientation={horizontal ? 'vertical' : 'horizontal'}
      withLegend={series.length > 1}
      legendProps={CHART_LEGEND_PROPS}
      valueFormatter={valueFormatter(valueSuffix, valuePrefix)}
      withBarValueLabel={withBarValueLabel}
      {...(withBarValueLabel
        ? { valueLabelProps: barValueLabelProps(chartColors.barLabelColor) }
        : {})}
      {...(horizontal
        ? horizontalBarProps()
        : withBarValueLabel
          ? verticalBarLabelProps()
          : {})}
      styles={{
        ...CHART_LEGEND_STYLES,
        legendItemName: { color: chartColors.textColor },
      }}
      {...chartColors}
      {...axis}
      style={style}
    />
  );
}

/** Match IDE pie orientation (Recharts default is 180° off). */
const PIE_START_ANGLE = 180;
const PIE_END_ANGLE = 540;

function formatPieSlicePercent(value: number, total: number): string {
  if (total <= 0) {
    return '0%';
  }
  const percent = (value / total) * 100;
  if (percent < 10 && Math.abs(percent - Math.round(percent)) > 0.05) {
    return `${percent.toFixed(1)}%`;
  }
  return `${Math.round(percent)}%`;
}

function pieDonutThickness(size: number): number {
  return Math.max(28, Math.round(size * 0.22));
}

function pieLegendPayload(
  items: { name: string; color: string }[],
): Record<string, unknown>[] {
  return items.map((item) => ({
    dataKey: item.name,
    value: item.name,
    color: item.color,
    type: 'circle',
  }));
}

function pieLegendSeries(
  items: { name: string; color: string; value: number }[],
  total: number,
) {
  return items.map((item) => ({
    name: item.name,
    color: item.color,
    label: `${item.name} ${formatPieSlicePercent(item.value, total)}`,
  }));
}

export function PieChart({ data, size = 200, donut, style }: PieChartProps) {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const theme = useHostTheme();
  const seriesColor = useSeriesColor();
  const mantineData = data.map((point, index) => ({
    name: point.label,
    value: point.value,
    color: seriesColor(point.tone, index),
  }));
  const total = mantineData.reduce((sum, row) => sum + row.value, 0);
  const pieAngles = {
    startAngle: PIE_START_ANGLE,
    endAngle: PIE_END_ANGLE,
  };
  const pieCellProps = (name: string) => ({
    opacity:
      highlighted === null || highlighted === name ? 1 : 0.35,
  });
  const chart = donut ? (
    <DonutChart
      data={mantineData}
      size={size}
      thickness={pieDonutThickness(size)}
      withTooltip
      chartLabel={total}
      cellProps={(cell) => pieCellProps(cell.name)}
      {...pieAngles}
    />
  ) : (
    <MantinePieChart
      data={mantineData}
      size={size}
      withTooltip
      withLabelsLine={false}
      cellProps={(cell) => pieCellProps(cell.name)}
      {...pieAngles}
    />
  );
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: size,
          minHeight: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {chart}
      </div>
      <ChartLegend
        payload={pieLegendPayload(mantineData)}
        series={pieLegendSeries(mantineData, total)}
        legendPosition="bottom"
        centered
        onHighlight={setHighlighted}
        mt="sm"
        w="100%"
        styles={{
          legend: {
            justifyContent: 'center',
            gap: 12,
            color: theme.text.primary,
          },
          legendItemName: {
            color: theme.text.primary,
          },
        }}
      />
    </div>
  );
}
