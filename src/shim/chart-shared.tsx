/**
 * Shared chart data shaping and axis helpers (no @mantine/charts component imports).
 */
import type { ChartReferenceLineProps } from '@mantine/charts'
import type { XAxisProps, YAxisProps } from 'recharts'
import type { CanvasChartValueAxisExtra } from '../superset/chart-extra'
import type { BarChartProps } from '../superset/index'
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

import type { ChartReferenceLine, ChartSeries, ChartTone } from '../vendor/canvas-sdk/chart-primitives.js'

export const CHART_LEGEND_PROPS = {
	verticalAlign: 'bottom' as const,
	align: 'center' as const,
}

export const CHART_LEGEND_STYLES = {
	legend: { justifyContent: 'center' },
} as const

export function useSeriesColor(): (
	tone: ChartTone | undefined,
	index: number,
) => string {
	const theme = useHostTheme()
	const sequence = theme.chart.sequence
	return (tone, index) =>
		tone ? toneHex[tone] : sequence[index % sequence.length]
}

export function useChartColorProps(): { textColor: string; barLabelColor: string } {
	const theme = useHostTheme()
	const text = theme.text.primary
	return { textColor: text, barLabelColor: text }
}

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

export function toMantineSeries(
	series: ChartSeries[],
	seriesColor: (tone: ChartTone | undefined, index: number) => string,
) {
	return series.map((s, index) => ({
		name: s.name,
		color: seriesColor(s.tone, index),
	}))
}

export function valueFormatter(valueSuffix?: string, valuePrefix?: string) {
	return (value: number) => `${valuePrefix ?? ''}${value}${valueSuffix ?? ''}`
}

export function mantineReferenceLines(
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

type ValueAxisProps = Pick<
	BarChartProps,
  'beginAtZero' | 'yMin' | 'yMax' | 'referenceLines'
>

type AxisChartProps = {
	yAxisProps?: Omit<YAxisProps, 'ref'>;
	xAxisProps?: Omit<XAxisProps, 'ref'>;
	referenceLines?: ChartReferenceLineProps[]
}

const NON_LINEAR_SCALES = new Set(['log', 'symlog', 'pow', 'sqrt'])

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

export function defaultShowBarValues(
	showValues: boolean | undefined,
	series: ChartSeries[],
	categories: string[],
): boolean {
	if (showValues !== undefined) {
		return showValues
	}
	return series.length === 1 && categories.length <= 8
}

export function withPerCategoryBarColors(
	data: Record<string, string | number>[],
	series: ChartSeries[],
	seriesColor: (tone: ChartTone | undefined, index: number) => string,
): Record<string, string | number>[] {
	if (series.length !== 1 || series[0].tone) {
		return data
	}
	return data.map((row, index) => ({
		...row,
		color: seriesColor(undefined, index),
	}))
}

const HORIZONTAL_CATEGORY_AXIS_WIDTH = 96
const CATEGORY_LABEL_CHAR_WIDTH = 6.5

function truncateCategoryAxisLabel(text: string, max: number): string {
	if (text.length <= max) {
		return text
	}
	return `${text.slice(0, Math.max(0, max - 1))}…`
}

function horizontalCategoryAxisTick(
	labelMax: number,
	props: {
		x?: string | number;
		y?: string | number;
		payload?: { value?: string | number }
	},
) {
	const x = typeof props.x === 'number' ? props.x : Number(props.x) || 0
	const y = typeof props.y === 'number' ? props.y : Number(props.y) || 0
	const full = String(props.payload?.value ?? '')
	const display = truncateCategoryAxisLabel(full, labelMax)
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

function horizontalBarValueLabelProps(barLabelColor: string) {
	return {
		...barValueLabelProps(barLabelColor),
		position: 'right' as const,
	}
}

export function horizontalBarProps(
	width = HORIZONTAL_CATEGORY_AXIS_WIDTH,
	withValueLabel = false,
) {
	const labelMax = Math.floor(width / CATEGORY_LABEL_CHAR_WIDTH)
	return {
		yAxisProps: {
			tick: (props: Parameters<typeof horizontalCategoryAxisTick>[1]) =>
				horizontalCategoryAxisTick(labelMax, props),
			width,
		},
		barChartProps: {
			margin: { right: withValueLabel ? 48 : 32 },
		},
		gridAxis: 'y' as const,
	}
}

function verticalBarLabelProps() {
	return {
		barChartProps: {
			margin: { top: 22 },
		},
	}
}

export { barValueLabelProps, horizontalBarValueLabelProps, verticalBarLabelProps }
