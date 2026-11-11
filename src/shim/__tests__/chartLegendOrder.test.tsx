import { describe, expect, it } from 'vitest'
import { renderWithProvider } from '../../test/render'
import { BarChart } from '../bar-chart'
import { CHART_LEGEND_PROPS, CHART_TOOLTIP_PROPS } from '../chart-shared'
import { LineChart } from '../line-chart'

describe('chart label order', () => {
  it('disables Recharts default legend and tooltip sorters', () => {
    expect(CHART_LEGEND_PROPS.itemSorter).toBeNull()
    expect(CHART_TOOLTIP_PROPS.itemSorter).toBeNull()
  })

  const series = [
    { name: 'Off-heap reclaimed', data: [12, 18], tone: 'info' as const },
    { name: 'Heap reclaimed', data: [58, 55], tone: 'warning' as const },
  ]
  const categories = ['T+5s', 'T+10s']
  const seriesNames = series.map(s => s.name)

  it.each([
    ['LineChart', LineChart],
    ['BarChart', BarChart],
  ] as const)('keeps %s legend order in source series order', (_, Chart) => {
    const { container } = renderWithProvider(
      <Chart categories={categories} series={series} height={160} />,
    )
    const legend = container.querySelector('[class*="ChartLegend-legend"]')
    expect(legend).toBeTruthy()
    const names = legend!.querySelectorAll(
      '[class*="ChartLegend-legendItemName"]',
    )
    expect([...names].map(el => el.textContent?.trim())).toEqual(seriesNames)
  })
})
