/**
 * Mantine-backed implementation of the `cursor/canvas` module.
 *
 * A canvas authored against the real Cursor SDK imports only from
 * `cursor/canvas`. A Vite alias + tsconfig path redirect that import here, so
 * the same untouched canvas source renders in a plain web app on GitHub Pages.
 *
 * This barrel re-exports split UI/chart/diff/dag/todo modules so export builds
 * can tree-shake unused Mantine and Recharts code. API-compatible with the real
 * SDK at `~/.cursor/skills-cursor/canvas/sdk/*.d.ts`.
 */

export { useEffect, useMemo, useRef, useState } from 'react'
export type { CSSProperties, RefObject } from 'react'
export type {
  CanvasHostThemeBrand,
  CategoryPalette,
  ChartPalette,
  Color,
} from '../vendor/canvas-sdk/canvas-tokens.js'
export type { SelectOption } from '../vendor/canvas-sdk/form-primitives.js'
export type {
  CanvasAction,
  CanvasHostTheme,
  SetCanvasState,
} from '../vendor/canvas-sdk/hooks.js'
export type {
  CanvasPalette,
  CanvasTokens,
} from '../vendor/canvas-sdk/theme.js'
export type {
  CalloutTone,
  CardSize,
  CardVariant,
  PillSize,
  PillTone,
  StatTone,
  TableColumnAlign,
  TableRowTone,
  TextWeight,
} from '../vendor/canvas-sdk/ui-primitives.js'
export type { UsageBarSegment } from '../vendor/canvas-sdk/usage-bar.js'
export type {
  BarChartProps,
  ButtonProps,
  CalloutProps,
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CheckboxProps,
  CodeProps,
  CollapsibleSectionProps,
  DividerProps,
  DomForwardProps,
  GridProps,
  H1Props,
  H2Props,
  H3Props,
  IconButtonProps,
  LineChartProps,
  LinkProps,
  PieChartProps,
  PillProps,
  RowProps,
  SelectProps,
  StackProps,
  StatProps,
  SwatchProps,
  TableProps,
  TextAreaProps,
  TextInputProps,
  TextProps,
  ToggleProps,
  UsageBarProps,
} from '../superset/shim-props.js'

export { mergeStyle, useCanvasAction, useCanvasState } from './canvas-hooks'
export { BarChart } from './bar-chart'
export { LineChart } from './line-chart'
export { PieChart } from './pie-chart'
export type {
  CanvasBarChartExtra,
  CanvasChartExtra,
  CanvasChartScale,
  CanvasChartValueAxisExtra,
  CanvasLineChartExtra,
  ChartDataPoint,
  ChartReferenceLine,
  ChartSeries,
  ChartTone,
} from './chart-shared'
export { computeDAGLayout } from './dag'
export type {
  DAGLayoutEdge,
  DAGLayoutNode,
  DAGLayoutOptions,
  DAGLayoutRank,
  DAGLayoutResult,
} from './dag'
export { DiffStats, DiffView } from './diff'
export type {
  DiffLineData,
  DiffLineType,
  DiffStatsProps,
  DiffViewProps,
} from './diff'
export {
  canvasPaletteDark,
  canvasPaletteGrokDark,
  canvasPaletteGrokLight,
  canvasPaletteLight,
  canvasTokens,
  canvasTokensLight,
  categoryPaletteDark,
  categoryPaletteLight,
  colorPalette,
  usageColorSequence,
} from './theme'
export { TodoList, TodoListCard } from './todo'
export type {
  TodoItem,
  TodoListCardProps,
  TodoListProps,
  TodoStatus,
} from './todo'
export { useHostTheme } from './use-tokens'

export { Button, IconButton } from './ui/actions'
export { Card, CardBody, CardHeader } from './ui/card'
export { Callout, Pill, Stat } from './ui/display'
export { Checkbox, Select, TextArea, TextInput, Toggle } from './ui/form'
export { Divider, Grid, Row, Spacer, Stack } from './ui/layout'
export { CollapsibleSection, Swatch, UsageBar } from './ui/rich'
export { Table } from './ui/table'
export { Code, H1, H2, H3, Link, Text } from './ui/typography'
