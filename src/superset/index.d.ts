/**
 * `cursor/canvas` typings for this shim: the vendored Cursor SDK plus superset
 * features. Local exports below override the SDK's same-named exports.
 *
 * Superset-only chart fields use `extra`. Native DOM attrs on components use
 * `DomForwardProps` in `shim-props.d.ts` (web shim; IDE ignores unknown attrs).
 */
import type { JSX } from 'react'

export * from '../vendor/canvas-sdk/index.js'
export type * from './chart-extra.js'

import type {
  BarChartProps,
  ButtonProps,
  CalloutProps,
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CheckboxProps,
  CodeProps,
  CollapsibleSectionProps,
  DiffStatsProps,
  DiffViewProps,
  DividerProps,
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
  TodoListCardProps,
  TodoListProps,
  ToggleProps,
  UsageBarProps,
} from './shim-props.js'

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
  DiffStatsProps,
  DiffViewProps,
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
  TodoListCardProps,
  TodoListProps,
  ToggleProps,
  UsageBarProps,
} from './shim-props.js'

export declare function Stack(props: StackProps): JSX.Element
export declare function Row(props: RowProps): JSX.Element
export declare function Grid(props: GridProps): JSX.Element
export declare function Divider(props: DividerProps): JSX.Element
export declare function H1(props: H1Props): JSX.Element
export declare function H2(props: H2Props): JSX.Element
export declare function H3(props: H3Props): JSX.Element
export declare function Text(props: TextProps): JSX.Element
export declare function Code(props: CodeProps): JSX.Element
export declare function Link(props: LinkProps): JSX.Element
export declare function Card(props: CardProps): JSX.Element
export declare function CardHeader(props: CardHeaderProps): JSX.Element
export declare function CardBody(props: CardBodyProps): JSX.Element
export declare function Button(props: ButtonProps): JSX.Element
export declare function Pill(props: PillProps): JSX.Element
export declare function Stat(props: StatProps): JSX.Element
export declare function Callout(props: CalloutProps): JSX.Element
export declare function Table(props: TableProps): JSX.Element
export declare function TextInput(props: TextInputProps): JSX.Element
export declare function TextArea(props: TextAreaProps): JSX.Element
export declare function Checkbox(props: CheckboxProps): JSX.Element
export declare function Toggle(props: ToggleProps): JSX.Element
export declare function Select(props: SelectProps): JSX.Element
export declare function IconButton(props: IconButtonProps): JSX.Element
export declare function BarChart(props: BarChartProps): JSX.Element
export declare function LineChart(props: LineChartProps): JSX.Element
export declare function PieChart(props: PieChartProps): JSX.Element
export declare function CollapsibleSection(props: CollapsibleSectionProps): JSX.Element
export declare function Swatch(props: SwatchProps): JSX.Element
export declare function UsageBar(props: UsageBarProps): JSX.Element
export declare function TodoList(props: TodoListProps): JSX.Element
export declare function TodoListCard(props: TodoListCardProps): JSX.Element
export declare function DiffStats(props: DiffStatsProps): JSX.Element
export declare function DiffView(props: DiffViewProps): JSX.Element