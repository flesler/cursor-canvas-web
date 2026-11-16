import type { ComponentPropsWithoutRef, JSX } from 'react'
import type { CollapsibleSectionProps as SdkCollapsibleSectionProps } from '../vendor/canvas-sdk/collapsible-section.js'
import type { BarChartProps as SdkBarChartProps, LineChartProps as SdkLineChartProps, PieChartProps as SdkPieChartProps } from '../vendor/canvas-sdk/chart-primitives.js'
import type { DiffStatsProps as SdkDiffStatsProps, DiffViewProps as SdkDiffViewProps } from '../vendor/canvas-sdk/diff-view.js'
import type { CheckboxProps as SdkCheckboxProps, IconButtonProps as SdkIconButtonProps, SelectProps as SdkSelectProps, TextAreaProps as SdkTextAreaProps, TextInputProps as SdkTextInputProps, ToggleProps as SdkToggleProps } from '../vendor/canvas-sdk/form-primitives.js'
import type { SwatchProps as SdkSwatchProps } from '../vendor/canvas-sdk/swatch.js'
import type { TodoListCardProps as SdkTodoListCardProps, TodoListProps as SdkTodoListProps } from '../vendor/canvas-sdk/todo-list.js'
import type { ButtonProps as SdkButtonProps, CalloutProps as SdkCalloutProps, CardBodyProps as SdkCardBodyProps, CardHeaderProps as SdkCardHeaderProps, CardProps as SdkCardProps, CodeProps as SdkCodeProps, DividerProps as SdkDividerProps, GridProps as SdkGridProps, H1Props as SdkH1Props, H2Props as SdkH2Props, H3Props as SdkH3Props, LinkProps as SdkLinkProps, PillProps as SdkPillProps, RowProps as SdkRowProps, StackProps as SdkStackProps, StatProps as SdkStatProps, TableProps as SdkTableProps, TextProps as SdkTextProps } from '../vendor/canvas-sdk/ui-primitives.js'
import type { UsageBarProps as SdkUsageBarProps } from '../vendor/canvas-sdk/usage-bar.js'
import type { CanvasBarChartExtra, CanvasLineChartExtra } from './chart-extra.js'

/** Web shim: SDK prop bag + native attrs on the rendered host node. */
export type DomForwardProps<
  TSdk,
  TTag extends keyof JSX.IntrinsicElements = 'div',
  THostConflict extends keyof JSX.IntrinsicElements[TTag] = never,
> = TSdk &
  Omit<ComponentPropsWithoutRef<TTag>, keyof TSdk | THostConflict>

type FieldHostConflict = 'size' | 'color' | 'defaultValue' | 'defaultChecked'

export type StackProps = DomForwardProps<SdkStackProps, 'div'>
export type RowProps = DomForwardProps<SdkRowProps, 'div'>
export type GridProps = DomForwardProps<SdkGridProps, 'div'>
export type DividerProps = DomForwardProps<SdkDividerProps, 'div'>
export type H1Props = DomForwardProps<SdkH1Props, 'h1'>
export type H2Props = DomForwardProps<SdkH2Props, 'h2'>
export type H3Props = DomForwardProps<SdkH3Props, 'h3'>
export type TextProps = DomForwardProps<SdkTextProps, 'p'>
export type CodeProps = DomForwardProps<SdkCodeProps, 'code'>
export type LinkProps = DomForwardProps<SdkLinkProps, 'a'>
export type CardProps = DomForwardProps<SdkCardProps, 'div'>
export type CardHeaderProps = DomForwardProps<SdkCardHeaderProps, 'div'>
export type CardBodyProps = DomForwardProps<SdkCardBodyProps, 'div'>
export type ButtonProps = DomForwardProps<SdkButtonProps, 'button'>
export type PillProps = DomForwardProps<SdkPillProps, 'div'>
export type StatProps = DomForwardProps<SdkStatProps, 'div'>
export type CalloutProps = DomForwardProps<SdkCalloutProps, 'div'>
export type TableProps = DomForwardProps<SdkTableProps, 'table'>
export type TextInputProps = DomForwardProps<SdkTextInputProps, 'input', FieldHostConflict>
export type TextAreaProps = DomForwardProps<SdkTextAreaProps, 'textarea', FieldHostConflict>
export type CheckboxProps = DomForwardProps<SdkCheckboxProps, 'input', FieldHostConflict>
export type ToggleProps = DomForwardProps<SdkToggleProps, 'input', FieldHostConflict>
export type SelectProps = DomForwardProps<SdkSelectProps, 'input', FieldHostConflict>
export type IconButtonProps = DomForwardProps<SdkIconButtonProps, 'button', 'color'>
export type BarChartProps = DomForwardProps<
  SdkBarChartProps & { extra?: CanvasBarChartExtra },
  'div'
>
export type LineChartProps = DomForwardProps<
  SdkLineChartProps & {
    extra?: CanvasLineChartExtra;
    /** @deprecated Use `extra.smooth`. */
    smooth?: boolean
  },
  'div'
>
export type PieChartProps = DomForwardProps<SdkPieChartProps, 'div'>
export type CollapsibleSectionProps = DomForwardProps<SdkCollapsibleSectionProps, 'div'>
export type SwatchProps = DomForwardProps<SdkSwatchProps, 'span'>
export type UsageBarProps = DomForwardProps<SdkUsageBarProps, 'div'>
export type TodoListProps = DomForwardProps<SdkTodoListProps, 'div'>
export type TodoListCardProps = DomForwardProps<SdkTodoListCardProps, 'div'>
export type DiffStatsProps = DomForwardProps<SdkDiffStatsProps, 'span'>
export type DiffViewProps = DomForwardProps<SdkDiffViewProps, 'div'>