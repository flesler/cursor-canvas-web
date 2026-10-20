import { describe, expect, it } from 'vitest'
import { valueAxisChartProps } from '../charts'

describe('valueAxisChartProps', () => {
	it('keeps the SDK zero-based domain without extra', () => {
		expect(valueAxisChartProps({})).toEqual({
			yAxisProps: { domain: [0, 'auto'] },
			referenceLines: undefined,
		})
	})

	it('merges extra.valueAxis over the SDK domain', () => {
		const axis = valueAxisChartProps({ valueAxis: { tickCount: 3, domain: [5, 50] } })
		expect(axis.yAxisProps).toEqual({ tickCount: 3, domain: [5, 50] })
	})

	it('defaults non-linear scales to a [1, dataMax] domain', () => {
		const axis = valueAxisChartProps({ valueAxis: { scale: 'log' } })
		expect(axis.yAxisProps).toEqual({
			scale: 'log',
			type: 'number',
			allowDataOverflow: true,
			allowDecimals: true,
			domain: [1, 'dataMax'],
		})
	})

	it('targets the X axis on horizontal bars', () => {
		const axis = valueAxisChartProps({ horizontal: true, valueAxis: { unit: '%' } })
		expect(axis.xAxisProps).toEqual({ domain: [0, 'auto'], unit: '%' })
		expect(axis.yAxisProps).toBeUndefined()
	})

	it('applies extra on stacked charts, which have no SDK domain', () => {
		expect(valueAxisChartProps({ stacked: true })).toEqual({ referenceLines: undefined })
		const axis = valueAxisChartProps({ stacked: true, valueAxis: { tickCount: 4 } })
		expect(axis.yAxisProps).toEqual({ tickCount: 4 })
	})
})
