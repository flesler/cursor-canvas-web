import { ChartLegend, PieChart as MantinePieChart } from '@mantine/charts'
import '@mantine/charts/styles.css'
import { lazy, Suspense, useState } from 'react'
import type { PieChartProps } from '../vendor/canvas-sdk/chart-primitives.js'
import { useSeriesColor } from './chart-shared'
import { useHostTheme } from './use-tokens'

const PieDonutChart = lazy(() =>
  import('./pie-donut.js').then(m => ({ default: m.PieDonutChart })),
)

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
    <Suspense fallback={null}>
      <PieDonutChart
        data={mantineData}
        size={size}
        highlighted={highlighted}
      />
    </Suspense>
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
