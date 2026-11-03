import type { LineChartCurveType } from '@mantine/charts'
import { AreaChart, LineChart as MantineLineChart } from '@mantine/charts'
import '@mantine/charts/styles.css'
import type { LineChartProps } from '../superset/index'
import { CHART_LEGEND_PROPS, CHART_LEGEND_STYLES, reshapeLineChartData, toMantineSeries, useChartColorProps, useSeriesColor, valueAxisChartProps, valueFormatter } from './chart-shared'

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
