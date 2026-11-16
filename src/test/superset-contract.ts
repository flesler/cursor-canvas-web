/**
 * Type-only checks on `src/superset/index.d.ts`, the `cursor/canvas` typings
 * consumers such as open-canvas verify against (this repo maps `cursor/canvas`
 * to the runtime barrel, which re-exports the same widened props).
 * Prefer named imports from `../superset/index` for widened props; `Superset.*`
 * namespace members can still resolve to the star-exported SDK shapes.
 */
import type * as Superset from '../superset/index'
import type { StackProps } from '../superset/index'

/** SDK exports pass through the `export *`. */
export type SdkPassthrough = [typeof Superset.Stack, Superset.ChartSeries]

/** Exercises every superset field so removing one breaks typecheck. */
export const lineChartSample: Superset.LineChartProps = {
  categories: [],
  series: [],
  fill: true,
  extra: {
    smooth: true,
    stacked: true,
    valueAxis: { scale: 'log', domain: [1, 'dataMax'], allowDecimals: false },
  },
}

export const barChartSample: Superset.BarChartProps = {
  categories: [],
  series: [],
  extra: {
    valueAxis: { scale: 'sqrt', tickCount: 4 },
    categoryAxis: { width: 200 },
  },
}

/** DOM passthrough is web-shim superset; IDE ignores unknown attrs at compile time. */
export const stackDomPassthrough: StackProps = {
  children: null,
  'aria-label': 'Metrics',
}
