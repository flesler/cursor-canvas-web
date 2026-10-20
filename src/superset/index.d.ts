/**
 * `cursor/canvas` typings for this shim: the vendored Cursor SDK plus superset
 * features. Local exports below override the SDK's same-named exports.
 *
 * Superset props on SDK components go under `extra`, which the IDE ignores.
 */
import type { JSX } from 'react'
import type { BarChartProps as SdkBarChartProps, LineChartProps as SdkLineChartProps } from '../vendor/canvas-sdk/index.js'
import type { CanvasBarChartExtra, CanvasLineChartExtra } from './chart-extra.js'

export * from '../vendor/canvas-sdk/index.js'
export type * from './chart-extra.js'

export type BarChartProps = SdkBarChartProps & {
  extra?: CanvasBarChartExtra
}

export type LineChartProps = SdkLineChartProps & {
  extra?: CanvasLineChartExtra;
  /** @deprecated Use `extra.smooth`. */
  smooth?: boolean
}

export declare function BarChart(props: BarChartProps): JSX.Element
export declare function LineChart(props: LineChartProps): JSX.Element
