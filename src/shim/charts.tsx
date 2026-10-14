/**
 * Chart primitives mapped onto `@mantine/charts`.
 *
 * The SDK describes charts as parallel `categories` + `series[]` arrays (or a
 * flat `data` array for pie); Mantine wants an array of row objects plus a
 * series descriptor. We reshape here and map `tone` -> color.
 */
import type { ChartReferenceLineProps } from '@mantine/charts';
import {
  AreaChart,
  DonutChart,
  BarChart as MantineBarChart,
  LineChart as MantineLineChart,
  PieChart as MantinePieChart,
} from '@mantine/charts';
import { chartColorSequence, toneHex } from './theme';

export type {
  BarChartProps,
  ChartDataPoint,
  ChartReferenceLine,
  ChartSeries,
  ChartTone,
  LineChartProps,
  PieChartProps,
} from '../vendor/canvas-sdk/chart-primitives.js';

import type {
  BarChartProps,
  ChartReferenceLine,
  ChartSeries,
  ChartTone,
  LineChartProps,
  PieChartProps,
} from '../vendor/canvas-sdk/chart-primitives.js';

type ValueAxisProps = Pick<
  BarChartProps,
  'beginAtZero' | 'yMin' | 'yMax' | 'referenceLines'
>;

function seriesColor(tone: ChartTone | undefined, index: number): string {
  return tone
    ? toneHex[tone]
    : chartColorSequence[index % chartColorSequence.length];
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

function toMantineSeries(series: ChartSeries[]) {
  return series.map((s, index) => ({
    name: s.name,
    color: seriesColor(s.tone, index),
  }));
}

function valueFormatter(valueSuffix?: string, valuePrefix?: string) {
  if (!valueSuffix && !valuePrefix) {
    return undefined;
  }
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
}: LineChartProps) {
  const data = reshapeLineChartData(categories, series);
  const mantineSeries = toMantineSeries(series);
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
    curveType: 'monotone' as const,
    withLegend: series.length > 1,
    valueFormatter: valueFormatter(valueSuffix, valuePrefix),
    withPointLabels: showValues ?? categories.length <= 20,
    tooltipProps: showHoverGuide ? undefined : { cursor: false },
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
      series={toMantineSeries(series)}
      type={type}
      orientation={horizontal ? 'vertical' : 'horizontal'}
      withLegend={series.length > 1}
      valueFormatter={valueFormatter(valueSuffix, valuePrefix)}
      withBarValueLabel={withBarValueLabel}
      {...axis}
      style={style}
    />
  );
}

export function PieChart({ data, size = 200, donut, style }: PieChartProps) {
  const mantineData = data.map((point, index) => ({
    name: point.label,
    value: point.value,
    color: seriesColor(point.tone, index),
  }));
  const chart = donut ? (
    <DonutChart data={mantineData} size={size} withTooltip style={style} />
  ) : (
    <MantinePieChart
      data={mantineData}
      size={size}
      withTooltip
      withLabelsLine={false}
      style={style}
    />
  );
  return (
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
  );
}
