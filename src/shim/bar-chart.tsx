import { BarChart as MantineBarChart } from '@mantine/charts'
import '@mantine/charts/styles.css'
import type { BarChartProps } from '../superset/index'
import { barValueLabelProps, CHART_LEGEND_PROPS, CHART_LEGEND_STYLES, CHART_TOOLTIP_PROPS, defaultShowBarValues, horizontalBarProps, horizontalBarValueLabelProps, reshapeLineChartData, toMantineSeries, useChartColorProps, useSeriesColor, valueAxisChartProps, valueFormatter, verticalBarLabelProps, withPerCategoryBarColors } from './chart-shared'

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
  const data = withPerCategoryBarColors(
    reshapeLineChartData(categories, series),
    series,
    seriesColor,
  )
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
      tooltipProps={CHART_TOOLTIP_PROPS}
      valueFormatter={valueFormatter(valueSuffix, valuePrefix)}
      withBarValueLabel={withBarValueLabel}
      {...(withBarValueLabel
        ? {
          valueLabelProps: horizontal
            ? horizontalBarValueLabelProps(chartColors.barLabelColor)
            : barValueLabelProps(chartColors.barLabelColor),
        }
        : {})}
      {...(horizontal
        ? horizontalBarProps(extra?.categoryAxis?.width, withBarValueLabel)
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
