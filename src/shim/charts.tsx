/**
 * Chart primitives mapped onto `@mantine/charts`.
 *
 * The SDK describes charts as parallel `categories` + `series[]` arrays (or a
 * flat `data` array for pie); Mantine wants an array of row objects plus a
 * series descriptor. We reshape here and map `tone` -> color.
 */
import type { ChartReferenceLineProps, LineChartCurveType } from '@mantine/charts'
import { AreaChart, ChartLegend, DonutChart, BarChart as MantineBarChart, LineChart as MantineLineChart, PieChart as MantinePieChart } from '@mantine/charts'
import { useState } from 'react'
import type { XAxisProps, YAxisProps } from 'recharts'
import type { CanvasChartValueAxisExtra } from '../superset/chart-extra'
import type { BarChartProps, LineChartProps } from '../superset/index'
import { toneHex } from './theme'
import { useHostTheme } from './use-tokens'

export type {
	CanvasBarChartExtra,
	CanvasChartExtra,
	CanvasChartScale,
	CanvasChartValueAxisExtra,
	CanvasLineChartExtra,
} from '../superset/chart-extra'
export type { BarChartProps, LineChartProps } from '../superset/index'
export type {
	ChartDataPoint,
	ChartReferenceLine,
	ChartSeries,
	ChartTone,
	PieChartProps,
} from '../vendor/canvas-sdk/chart-primitives.js'

import type { ChartReferenceLine, ChartSeries, ChartTone, PieChartProps } from '../vendor/canvas-sdk/chart-primitives.js'

type ValueAxisProps = Pick<
	BarChartProps,
  'beginAtZero' | 'yMin' | 'yMax' | 'referenceLines'
>

/** Mantine cartesian charts default legend to top; IDE places it below, centered. */
const CHART_LEGEND_PROPS = {
	verticalAlign: 'bottom' as const,
	align: 'center' as const,
}

const CHART_LEGEND_STYLES = {
	legend: { justifyContent: 'center' },
} as const

function useSeriesColor(): (
	tone: ChartTone | undefined,
	index: number,
) => string {
	const theme = useHostTheme()
	const sequence = theme.chart.sequence
	return (tone, index) =>
		tone ? toneHex[tone] : sequence[index % sequence.length]
}

/** IDE charts use host foreground for axes/legends, not Mantine `dimmed`. */
function useChartColorProps(): { textColor: string; barLabelColor: string } {
	const theme = useHostTheme()
	const text = theme.text.primary
	return { textColor: text, barLabelColor: text }
}

/**
 * Fork-only export (not in IDE `index.d.ts`); keeps chart data shaping stable for
 * Mantine — listed under “fork-only” in `npm run check:sdk-exports`.
 */
export function reshapeLineChartData(
	categories: string[],
	series: ChartSeries[],
): Record<string, string | number>[] {
	return categories.map((category, index) => {
		const row: Record<string, string | number> = { category }
		for (const s of series) {
			row[s.name] = s.data[index] ?? 0
		}
		return row
	})
}

function toMantineSeries(
	series: ChartSeries[],
	seriesColor: (tone: ChartTone | undefined, index: number) => string,
) {
	return series.map((s, index) => ({
		name: s.name,
		color: seriesColor(s.tone, index),
	}))
}

function valueFormatter(valueSuffix?: string, valuePrefix?: string) {
	return (value: number) => `${valuePrefix ?? ''}${value}${valueSuffix ?? ''}`
}

function mantineReferenceLines(
	lines: ChartReferenceLine[] | undefined,
	horizontal: boolean,
): ChartReferenceLineProps[] | undefined {
	if (!lines?.length) {
		return undefined
	}
	return lines.map(line => ({
		...(horizontal ? { x: line.value } : { y: line.value }),
		label: line.label,
		color: line.tone ? toneHex[line.tone] : toneHex.neutral,
	}))
}

type AxisChartProps = {
	yAxisProps?: Omit<YAxisProps, 'ref'>;
	xAxisProps?: Omit<XAxisProps, 'ref'>;
	referenceLines?: ChartReferenceLineProps[]
}

const NON_LINEAR_SCALES = new Set(['log', 'symlog', 'pow', 'sqrt'])

/** Non-linear scales break on a zero-based domain, so default to `[1, 'dataMax']`. */
function normalizeValueAxisExtra(
	valueAxis: CanvasChartValueAxisExtra,
): CanvasChartValueAxisExtra {
	const { scale } = valueAxis
	if (typeof scale !== 'string' || !NON_LINEAR_SCALES.has(scale)) {
		return valueAxis
	}
	return {
		...valueAxis,
		type: valueAxis.type ?? 'number',
		allowDataOverflow: valueAxis.allowDataOverflow ?? true,
		allowDecimals: valueAxis.allowDecimals ?? true,
		domain: valueAxis.domain ?? [1, 'dataMax'],
	}
}

export function valueAxisChartProps(
	opts: ValueAxisProps & {
		horizontal?: boolean;
		stacked?: boolean;
		normalized?: boolean;
		valueAxis?: CanvasChartValueAxisExtra
	},
): AxisChartProps {
	const ref = mantineReferenceLines(opts.referenceLines, !!opts.horizontal)
	let domain: [number | string, number | string] | undefined
	if (!opts.stacked && !opts.normalized) {
		const beginAtZero = opts.beginAtZero !== false
		domain = [opts.yMin ?? (beginAtZero ? 0 : 'auto'), opts.yMax ?? 'auto']
	}
	const extra = opts.valueAxis ? normalizeValueAxisExtra(opts.valueAxis) : undefined
	if (!domain && !extra) {
		return { referenceLines: ref }
	}
	const axisProps = { ...(domain && { domain }), ...extra }
	return opts.horizontal
		? { xAxisProps: axisProps as Omit<XAxisProps, 'ref'>, referenceLines: ref }
		: { yAxisProps: axisProps, referenceLines: ref }
}

function defaultShowBarValues(
	showValues: boolean | undefined,
	series: ChartSeries[],
	categories: string[],
): boolean {
	if (showValues !== undefined) {
		return showValues
	}
	return series.length === 1 && categories.length <= 8
}

const HORIZONTAL_CATEGORY_LABEL_MAX = 14

function truncateCategoryAxisLabel(text: string): string {
	if (text.length <= HORIZONTAL_CATEGORY_LABEL_MAX) {
		return text
	}
	return `${text.slice(0, HORIZONTAL_CATEGORY_LABEL_MAX - 1)}…`
}

function horizontalCategoryAxisTick(props: {
	x?: string | number;
	y?: string | number;
	payload?: { value?: string | number }
}) {
	const x = typeof props.x === 'number' ? props.x : Number(props.x) || 0
	const y = typeof props.y === 'number' ? props.y : Number(props.y) || 0
	const full = String(props.payload?.value ?? '')
	const display = truncateCategoryAxisLabel(full)
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
	)
}

function barValueLabelProps(barLabelColor: string) {
	return {
		fontWeight: 700,
		fill: barLabelColor,
	}
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
	}
}

/** Room above vertical bars so value labels are not clipped. */
function verticalBarLabelProps() {
	return {
		barChartProps: {
			margin: { top: 22 },
		},
	}
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
	extra,
	smooth: legacySmooth,
}: LineChartProps) {
	const smooth = extra?.smooth ?? legacySmooth
	const seriesColor = useSeriesColor()
	const chartColors = useChartColorProps()
	const data = reshapeLineChartData(categories, series)
	const mantineSeries = toMantineSeries(series, seriesColor)
	const stacked = Boolean(fill && extra?.stacked)
	const axis = valueAxisChartProps({
		beginAtZero,
		yMin,
		yMax,
		referenceLines,
		horizontal: false,
		stacked,
		valueAxis: extra?.valueAxis,
	})
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
		...axis,
		style,
	}
	return fill ? (
		<AreaChart {...common} type={stacked ? 'stacked' : 'default'} />
	) : (
		<MantineLineChart {...common} />
	)
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
	extra,
}: BarChartProps) {
	const seriesColor = useSeriesColor()
	const chartColors = useChartColorProps()
	const data = reshapeLineChartData(categories, series)
	const type = normalized ? 'percent' : stacked ? 'stacked' : 'default'
	const axis = valueAxisChartProps({
		beginAtZero,
		yMin,
		yMax,
		referenceLines,
		horizontal,
		stacked,
		normalized,
		valueAxis: extra?.valueAxis,
	})
	const withBarValueLabel =
		!stacked &&
    !normalized &&
    defaultShowBarValues(showValues, series, categories)
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
			{...axis}
			style={style}
		/>
	)
}

/** Match IDE pie orientation (Recharts default is 180° off). */
const PIE_START_ANGLE = 180
const PIE_END_ANGLE = 540

function formatPieSlicePercent(value: number, total: number): string {
	if (total <= 0) {
		return '0%'
	}
	const percent = (value / total) * 100
	if (percent < 10 && Math.abs(percent - Math.round(percent)) > 0.05) {
		return `${percent.toFixed(1)}%`
	}
	return `${Math.round(percent)}%`
}

function pieDonutThickness(size: number): number {
	return Math.max(28, Math.round(size * 0.22))
}

function pieLegendPayload(
	items: { name: string; color: string }[],
): Record<string, unknown>[] {
	return items.map(item => ({
		dataKey: item.name,
		value: item.name,
		color: item.color,
		type: 'circle',
	}))
}

function pieLegendSeries(
	items: { name: string; color: string; value: number }[],
	total: number,
) {
	return items.map(item => ({
		name: item.name,
		color: item.color,
		label: `${item.name} ${formatPieSlicePercent(item.value, total)}`,
	}))
}

function DonutCenterLabel({
	total,
	family,
	primary,
	subtitle,
}: {
	total: number;
	family: string;
	primary: string;
	subtitle: string
}) {
	return (
		<text
			x="50%"
			y="50%"
			textAnchor="middle"
			dominantBaseline="central"
			fontFamily={family}
		>
			<tspan x="50%" dy="-0.4em" fontSize={20} fontWeight={600} fill={primary}>
				{total}
			</tspan>
			<tspan x="50%" dy="1.55em" fontSize={16} fontWeight={500} fill={subtitle}>
				Total
			</tspan>
		</text>
	)
}

export function PieChart({ data, size = 200, donut, style }: PieChartProps) {
	const [highlighted, setHighlighted] = useState<string | null>(null)
	const theme = useHostTheme()
	const seriesColor = useSeriesColor()
	const mantineData = data.map((point, index) => ({
		name: point.label,
		value: point.value,
		color: seriesColor(point.tone, index),
	}))
	const total = mantineData.reduce((sum, row) => sum + row.value, 0)
	const pieAngles = {
		startAngle: PIE_START_ANGLE,
		endAngle: PIE_END_ANGLE,
	}
	const pieCellProps = (name: string) => ({
		opacity:
      highlighted === null || highlighted === name ? 1 : 0.35,
	})
	const chart = donut ? (
		<DonutChart
			data={mantineData}
			size={size}
			thickness={pieDonutThickness(size)}
			withTooltip
			cellProps={cell => pieCellProps(cell.name)}
			{...pieAngles}
		>
			<DonutCenterLabel
				total={total}
				family={theme.typography.fontFamily}
				primary={theme.text.primary}
				subtitle={theme.text.secondary}
			/>
		</DonutChart>
	) : (
		<MantinePieChart
			data={mantineData}
			size={size}
			withTooltip
			withLabelsLine={false}
			cellProps={cell => pieCellProps(cell.name)}
			{...pieAngles}
		/>
	)
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
	)
}
