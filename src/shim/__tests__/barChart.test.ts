import { describe, expect, it } from 'vitest'
import { horizontalBarProps, withPerCategoryBarColors } from '../chart-shared'

const seriesColor = (tone: string | undefined, index: number) =>
  tone ?? `c${index}`

describe('withPerCategoryBarColors', () => {
  const rows = [
    { category: 'a', n: 1 },
    { category: 'b', n: 2 },
  ]

  it('colors each category of a single series', () => {
    expect(
      withPerCategoryBarColors(
        rows,
        [{ name: 'n', data: [1, 2] }],
        seriesColor,
      ),
    ).toEqual([
      { category: 'a', n: 1, color: 'c0' },
      { category: 'b', n: 2, color: 'c1' },
    ])
  })

  it('keeps series colors for a toned or multi-series chart', () => {
    expect(
      withPerCategoryBarColors(
        rows,
        [{ name: 'n', data: [1, 2], tone: 'info' }],
        seriesColor,
      ),
    ).toBe(rows)
    expect(
      withPerCategoryBarColors(
        rows,
        [
          { name: 'n', data: [1, 2] },
          { name: 'm', data: [3, 4] },
        ],
        seriesColor,
      ),
    ).toBe(rows)
  })
})

describe('horizontalBarProps', () => {
  it('draws only the value-axis grid', () => {
    expect(horizontalBarProps().gridAxis).toBe('y')
  })

  it('widens the category axis with extra.categoryAxis.width', () => {
    expect(horizontalBarProps().yAxisProps.width).toBe(96)
    expect(horizontalBarProps(200).yAxisProps.width).toBe(200)
  })

  it('leaves room for value labels past the bar end', () => {
    expect(horizontalBarProps(96, false).barChartProps.margin.right).toBe(32)
    expect(horizontalBarProps(96, true).barChartProps.margin.right).toBe(48)
  })
})
