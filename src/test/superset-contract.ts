/**
 * Type-only checks on `src/superset/index.d.ts`, the `cursor/canvas` typings
 * consumers such as open-canvas verify against (this repo's own tsconfig maps
 * `cursor/canvas` to the runtime barrel instead).
 */
import type * as Superset from '../superset/index';

/** SDK exports pass through the `export *`. */
export type SdkPassthrough = [typeof Superset.Stack, Superset.ChartSeries];

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
};

export const barChartSample: Superset.BarChartProps = {
  categories: [],
  series: [],
  extra: { valueAxis: { scale: 'sqrt', tickCount: 4 } },
};
