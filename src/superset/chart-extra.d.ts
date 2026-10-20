/**
 * Superset chart options, passed through the `extra` prop. The Cursor IDE
 * ignores `extra`, so the same canvas renders there with SDK defaults.
 */
import type { YAxisProps } from 'recharts'

/** Recharts `scale` shortcuts (`auto` + d3 scale names). */
export type CanvasChartScale = NonNullable<YAxisProps['scale']>

/**
 * Recharts props forwarded to the value axis: Y on column and line charts, X on
 * horizontal bar charts. Non-linear scales default `domain` to `[1, 'dataMax']`.
 */
export type CanvasChartValueAxisExtra = Pick<
	Omit<YAxisProps, 'ref'>,
  | 'scale'
  | 'domain'
  | 'type'
  | 'allowDataOverflow'
  | 'allowDecimals'
  | 'tickCount'
  | 'interval'
  | 'padding'
  | 'unit'
  | 'name'
>

export type CanvasChartExtra = {
	valueAxis?: CanvasChartValueAxisExtra
}

export type CanvasBarChartExtra = CanvasChartExtra

export type CanvasLineChartExtra = CanvasChartExtra & {
	/** Curved (`monotone`) segments; the IDE draws straight segments. */
	smooth?: boolean;
	/** Stack the filled areas. Requires `fill`. */
	stacked?: boolean
}
