/**
 * Mantine-backed implementation of the `cursor/canvas` module.
 *
 * A canvas authored against the real Cursor SDK imports only from
 * `cursor/canvas`. A Vite alias + tsconfig path redirect that import here, so
 * the same untouched canvas source renders in a plain web app on GitHub Pages.
 *
 * This barrel implements the UI/form/rich primitives + hooks and re-exports the
 * chart, diff, dag, and todo modules. It must stay API-compatible with the real
 * SDK declarations at `~/.cursor/skills-cursor/canvas/sdk/*.d.ts` — same props,
 * tone vocabularies, and signatures — so a canvas renders unchanged in both the
 * IDE and the web build.
 */
import {
  ActionIcon,
  Alert,
  Badge,
  Group,
  Button as MantineButton,
  Card as MantineCard,
  Checkbox as MantineCheckbox,
  Divider as MantineDivider,
  Select as MantineSelect,
  Stack as MantineStack,
  Table as MantineTable,
  Text as MantineText,
  Textarea as MantineTextarea,
  TextInput as MantineTextInput,
  Switch,
  Title,
} from '@mantine/core'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type CSSProperties,
} from 'react'

import type { CollapsibleSectionProps } from '../vendor/canvas-sdk/collapsible-section.js'
import type {
  CheckboxProps,
  IconButtonProps,
  SelectProps,
  TextAreaProps,
  TextInputProps,
  ToggleProps,
} from '../vendor/canvas-sdk/form-primitives.js'
import type {
  CanvasAction,
  SetCanvasState,
} from '../vendor/canvas-sdk/hooks.js'
import type { SwatchProps } from '../vendor/canvas-sdk/swatch.js'
import type {
  ButtonProps,
  CalloutProps,
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CodeProps,
  DividerProps,
  GridProps,
  H1Props,
  H2Props,
  H3Props,
  LinkProps,
  PillProps,
  RowProps,
  StackProps,
  StatProps,
  TableProps,
  TableRowTone,
  TextProps,
  TextWeight,
} from '../vendor/canvas-sdk/ui-primitives.js'
import type { UsageBarProps } from '../vendor/canvas-sdk/usage-bar.js'

import { toneColor, toneHex, usageColorSequence } from './theme'
import { useHostTheme } from './use-tokens'

/* --------------------------------------------------------------- re-exports */

export { useEffect, useMemo, useRef, useState } from 'react'
export type { CSSProperties, RefObject } from 'react'
export type {
  CanvasHostThemeBrand,
  CategoryPalette,
  ChartPalette,
  Color
} from '../vendor/canvas-sdk/canvas-tokens.js'
export type { CollapsibleSectionProps } from '../vendor/canvas-sdk/collapsible-section.js'
export type {
  CheckboxProps,
  IconButtonProps,
  SelectOption,
  SelectProps,
  TextAreaProps,
  TextInputProps,
  ToggleProps
} from '../vendor/canvas-sdk/form-primitives.js'
export type {
  CanvasAction,
  CanvasHostTheme,
  SetCanvasState
} from '../vendor/canvas-sdk/hooks.js'
export type { SwatchProps } from '../vendor/canvas-sdk/swatch.js'
export type {
  CanvasPalette,
  CanvasTokens
} from '../vendor/canvas-sdk/theme.js'
export type {
  ButtonProps,
  CalloutProps,
  CalloutTone,
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CardSize,
  CardVariant,
  CodeProps,
  DividerProps,
  GridProps,
  H1Props,
  H2Props,
  H3Props,
  LinkProps,
  PillProps,
  PillSize,
  PillTone,
  RowProps,
  StackProps,
  StatProps,
  StatTone,
  TableColumnAlign,
  TableProps,
  TableRowTone,
  TextProps,
  TextWeight
} from '../vendor/canvas-sdk/ui-primitives.js'
export type {
  UsageBarProps,
  UsageBarSegment
} from '../vendor/canvas-sdk/usage-bar.js'
export { BarChart, LineChart, PieChart } from './charts'
export type {
  BarChartProps,
  ChartDataPoint,
  ChartReferenceLine,
  ChartSeries,
  ChartTone,
  LineChartProps,
  PieChartProps
} from './charts'
export { computeDAGLayout } from './dag'
export type {
  DAGLayoutEdge,
  DAGLayoutNode,
  DAGLayoutOptions,
  DAGLayoutRank,
  DAGLayoutResult
} from './dag'
export { DiffStats, DiffView } from './diff'
export type {
  DiffLineData,
  DiffLineType,
  DiffStatsProps,
  DiffViewProps
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
  usageColorSequence
} from './theme'
export { TodoList, TodoListCard } from './todo'
export type {
  TodoItem,
  TodoListCardProps,
  TodoListProps,
  TodoStatus
} from './todo'
export { useHostTheme } from './use-tokens'

/* ------------------------------------------------------------------ hooks */

/**
 * Persistent state hook. The real SDK stores values in a `.canvas.data.json`
 * sidecar; on the web we persist to `localStorage` under `canvas:<key>`.
 */
export function useCanvasState<T>(
  key: string,
  defaultValue: T,
): [T, SetCanvasState<T>] {
  const storageKey = `canvas:${key}`;

  const [state, setState] = useState<T>(() => {
    if (typeof localStorage === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw === null ? defaultValue : (JSON.parse(raw) as T);
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback<SetCanvasState<T>>(
    (action) => {
      setState((prev) => {
        const next =
          typeof action === 'function'
            ? (action as (prev: T) => T)(prev)
            : action;
        try {
          localStorage?.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore quota / unavailable storage; state still updates in memory.
        }
        return next;
      });
    },
    [storageKey],
  );

  return [state, set];
}

/**
 * IDE actions are not available on the web host, so the returned dispatch is a
 * no-op (it logs in dev). Exists for API parity with the real SDK.
 */
export function useCanvasAction(): (action: CanvasAction) => void {
  return useCallback((action: CanvasAction) => {
    if (import.meta.env?.DEV) {
      console.info(
        '[cursor/canvas shim] useCanvasAction (no-op on web):',
        action,
      );
    }
  }, []);
}

/** Shallow-merge two style objects, `override` winning. */
export function mergeStyle(
  base: CSSProperties,
  override?: CSSProperties,
): CSSProperties {
  return { ...base, ...override };
}

/* ------------------------------------------------------------- typography */

function headingStyle(
  host: ReturnType<typeof useHostTheme>,
  level: 'h1' | 'h2' | 'h3',
  style?: CSSProperties,
): CSSProperties {
  const block = host.typography[level]
  return {
    fontFamily: host.typography.fontFamily,
    fontSize: block.fontSize,
    lineHeight: block.lineHeight,
    fontWeight: block.fontWeight,
    color: host.text.primary,
    margin: 0,
    ...style,
  }
}

export function H1({ children, style }: H1Props) {
  const host = useHostTheme();
  return (
    <Title order={1} style={headingStyle(host, 'h1', style)}>
      {children}
    </Title>
  );
}

export function H2({ children, style }: H2Props) {
  const host = useHostTheme();
  return (
    <Title order={2} style={headingStyle(host, 'h2', style)}>
      {children}
    </Title>
  );
}

export function H3({ children, style }: H3Props) {
  const host = useHostTheme();
  return (
    <Title order={3} style={headingStyle(host, 'h3', style)}>
      {children}
    </Title>
  );
}

const TEXT_WEIGHT: Record<TextWeight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export function Text({
  children,
  tone = 'primary',
  size = 'body',
  as = 'p',
  weight = 'normal',
  italic,
  truncate,
  style,
}: TextProps) {
  const theme = useHostTheme();
  return (
    <MantineText
      component={as}
      size={size === 'small' ? 'xs' : 'sm'}
      fw={TEXT_WEIGHT[weight]}
      c={tone === 'primary' ? undefined : theme.text[tone]}
      truncate={truncate}
      style={{
        fontStyle: italic ? 'italic' : undefined,
        ...(tone === 'primary' ? { color: theme.text.primary } : undefined),
        fontFamily: theme.typography.fontFamily,
        ...style,
      }}
    >
      {children}
    </MantineText>
  );
}

export function Code({ children, style }: CodeProps) {
  const host = useHostTheme();
  return (
    <code
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Code", monospace',
        fontSize: '0.92em',
        color: host.text.primary,
        background: host.fill.secondary,
        borderRadius: host.radius.sm,
        padding: '1px 4px',
        ...style,
      }}
    >
      {children}
    </code>
  );
}

export function Link({ children, href, style }: LinkProps) {
  const host = useHostTheme();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ color: host.text.link, ...style }}
    >
      {children}
    </a>
  );
}

/* ---------------------------------------------------------------- layout */

export function Stack({ children, gap, style }: StackProps) {
  return (
    <MantineStack gap={gap} style={style}>
      {children}
    </MantineStack>
  );
}

const FLEX: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  'space-between': 'space-between',
};

export function Row({
  children,
  gap,
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
}: RowProps) {
  return (
    <Group
      gap={gap}
      align={FLEX[align]}
      justify={FLEX[justify]}
      wrap={wrap ? 'wrap' : 'nowrap'}
      style={style}
    >
      {children}
    </Group>
  );
}

/** Flexible filler that pushes siblings apart inside a `Row`. */
export function Spacer() {
  return <div style={{ flex: 1 }} />;
}

export function Grid({ children, columns, gap = 16, align, style }: GridProps) {
  const gridTemplateColumns =
    typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap,
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Divider({ style }: DividerProps) {
  return <MantineDivider style={style} />;
}

/* ------------------------------------------------------------------ card */

const CardContext = createContext<{
  collapsible: boolean;
  open: boolean;
  toggle: () => void;
}>({
  collapsible: false,
  open: true,
  toggle: () => {},
});

export function Card({
  children,
  variant = 'default',
  collapsible = false,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  style,
}: CardProps) {
  const host = useHostTheme();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const toggle = useCallback(() => {
    const next = !open;
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }, [open, openProp, onOpenChange]);

  return (
    <MantineCard
      withBorder={variant !== 'borderless'}
      radius={host.radius.md}
      padding={0}
      style={{
        background: host.bg.elevated,
        borderColor: host.stroke.secondary,
        ...style,
      }}
    >
      <CardContext.Provider value={{ collapsible, open, toggle }}>
        {children}
      </CardContext.Provider>
    </MantineCard>
  );
}

export function CardHeader({ children, trailing, style }: CardHeaderProps) {
  const host = useHostTheme();
  const { collapsible, open, toggle } = useContext(CardContext);
  return (
    <div
      onClick={collapsible ? toggle : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '8px 14px',
        borderBottom: `1px solid ${host.stroke.secondary}`,
        fontSize: host.typography.small.fontSize,
        fontWeight: host.typography.h3.fontWeight,
        color: host.text.tertiary,
        fontFamily: host.typography.fontFamily,
        cursor: collapsible ? 'pointer' : undefined,
        userSelect: collapsible ? 'none' : undefined,
        ...style,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {collapsible && <Chevron expanded={open} />}
        {children}
      </span>
      {trailing != null && <span>{trailing}</span>}
    </div>
  );
}

export function CardBody({ children, style }: CardBodyProps) {
  const { collapsible, open } = useContext(CardContext);
  if (collapsible && !open) return null;
  return <div style={{ padding: 14, ...style }}>{children}</div>;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: expanded ? 'rotate(90deg)' : 'none',
        transition: 'transform 120ms',
      }}
      aria-hidden
    >
      <path
        d="M4 2.5L8 6l-4 3.5"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------- display */

export function Stat({ value, label, tone, style }: StatProps) {
  const host = useHostTheme();
  return (
    <div style={style}>
      <MantineText
        fz={22}
        fw={700}
        lh={1.2}
        style={{
          color: tone ? toneHex[tone] : host.text.primary,
          fontFamily: host.typography.fontFamily,
        }}
      >
        {value}
      </MantineText>
      <MantineText
        fz={12}
        style={{
          color: host.text.tertiary,
          fontFamily: host.typography.fontFamily,
        }}
      >
        {label}
      </MantineText>
    </div>
  );
}

export function Pill({
  children,
  active,
  tone = 'neutral',
  size = 'md',
  leadingContent,
  keyboardHint,
  title,
  style,
  onClick,
}: PillProps) {
  return (
    <Badge
      color={toneColor[tone]}
      variant={active ? 'filled' : 'light'}
      size={size === 'sm' ? 'sm' : 'md'}
      leftSection={leadingContent}
      rightSection={keyboardHint}
      title={title}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : undefined,
        textTransform: 'none',
        ...style,
      }}
    >
      {children}
    </Badge>
  );
}

export function Callout({
  children,
  tone = 'neutral',
  title,
  icon,
  style,
}: CalloutProps) {
  return (
    <Alert
      color={toneColor[tone]}
      title={title}
      icon={icon}
      variant="light"
      style={style}
    >
      {children}
    </Alert>
  );
}

/* ------------------------------------------------------------------ table */

const ROW_TONE_BG: Record<TableRowTone, string> = {
  success: 'rgba(31,138,101,0.12)',
  danger: 'rgba(207,45,86,0.12)',
  warning: 'rgba(232,163,61,0.14)',
  info: 'rgba(46,121,181,0.12)',
  neutral: 'rgba(136,136,168,0.12)',
};
export function Table({
  headers,
  rows,
  columnAlign,
  rowTone,
  framed = true,
  striped,
  stickyHeader,
  style,
  emptyMessage,
}: TableProps) {
  return (
    <MantineTable
      withTableBorder={framed}
      withColumnBorders={false}
      striped={striped}
      stickyHeader={stickyHeader}
      highlightOnHover
      style={style}
    >
      <MantineTable.Thead>
        <MantineTable.Tr>
          {headers.map((header, index) => (
            <MantineTable.Th key={index} ta={columnAlign?.[index] ?? 'left'}>
              {header}
            </MantineTable.Th>
          ))}
        </MantineTable.Tr>
      </MantineTable.Thead>
      <MantineTable.Tbody>
        {rows.length === 0 ? (
          <MantineTable.Tr>
            <MantineTable.Td colSpan={headers.length} ta="center" c="dimmed">
              {emptyMessage ?? 'No data'}
            </MantineTable.Td>
          </MantineTable.Tr>
        ) : (
          rows.map((row, rowIndex) => {
            const tone = rowTone?.[rowIndex];
            return (
              <MantineTable.Tr
                key={rowIndex}
                style={tone ? { background: ROW_TONE_BG[tone] } : undefined}
              >
                {headers.map((_, colIndex) => (
                  <MantineTable.Td
                    key={colIndex}
                    ta={columnAlign?.[colIndex] ?? 'left'}
                  >
                    {row[colIndex]}
                  </MantineTable.Td>
                ))}
              </MantineTable.Tr>
            );
          })
        )}
      </MantineTable.Tbody>
    </MantineTable>
  );
}

/* ----------------------------------------------------------------- actions */

const BUTTON_VARIANT = {
  primary: 'filled',
  secondary: 'default',
  ghost: 'subtle',
} as const;
export function Button({
  children,
  variant = 'secondary',
  disabled,
  type = 'button',
  style,
  onClick,
}: ButtonProps) {
  return (
    <MantineButton
      variant={BUTTON_VARIANT[variant]}
      color={variant === 'primary' ? 'accent' : undefined}
      size="xs"
      disabled={disabled}
      type={type}
      onClick={onClick}
      style={style}
    >
      {children}
    </MantineButton>
  );
}

export function IconButton({
  children,
  onClick,
  disabled,
  title,
  variant = 'default',
  size = 'md',
  style,
}: IconButtonProps) {
  return (
    <ActionIcon
      variant={variant === 'circle' ? 'light' : 'subtle'}
      radius={variant === 'circle' ? 'xl' : 'sm'}
      size={size === 'sm' ? 'sm' : 'md'}
      color="gray"
      disabled={disabled}
      title={title}
      aria-label={title}
      onClick={onClick}
      style={style}
    >
      {children}
    </ActionIcon>
  );
}

/* ------------------------------------------------------------------ form */

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  style,
}: SelectProps) {
  return (
    <MantineSelect
      value={value}
      data={options}
      placeholder={placeholder}
      disabled={disabled}
      allowDeselect={false}
      onChange={(next) => {
        if (next !== null) onChange?.(next);
      }}
      style={style}
    />
  );
}

export function Checkbox({
  checked,
  onChange,
  disabled,
  label,
  style,
}: CheckboxProps) {
  return (
    <MantineCheckbox
      checked={checked}
      disabled={disabled}
      label={label}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      style={style}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  disabled,
  size = 'sm',
  style,
}: ToggleProps) {
  return (
    <Switch
      checked={checked}
      disabled={disabled}
      size={size === 'sm' ? 'sm' : 'md'}
      onChange={(event) => onChange?.(event.currentTarget.checked)}
      style={style}
    />
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
  type,
  style,
}: TextInputProps) {
  return (
    <MantineTextInput
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      style={style}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  disabled,
  rows = 3,
  style,
}: TextAreaProps) {
  return (
    <MantineTextarea
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      autosize
      minRows={rows}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      style={style}
    />
  );
}

/* -------------------------------------------------------- rich primitives */

export function Swatch({ color, style }: SwatchProps) {
  const theme = useHostTheme();
  return (
    <span
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 4,
        background: theme.category[color],
        flex: '0 0 auto',
        ...style,
      }}
    />
  );
}

export function UsageBar({
  segments,
  total,
  topLeftLabel,
  topRightLabel,
  style,
}: UsageBarProps) {
  const theme = useHostTheme();
  const safeTotal = total > 0 ? total : 1;
  const used = segments.reduce(
    (sum, s) => sum + (Number.isFinite(s.value) && s.value > 0 ? s.value : 0),
    0,
  );
  const remainder = Math.max(0, safeTotal - used);
  return (
    <div style={style}>
      {(topLeftLabel != null || topRightLabel != null) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            color: theme.text.secondary,
            marginBottom: 6,
          }}
        >
          <span>{topLeftLabel}</span>
          <span>{topRightLabel}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: 2, height: 8 }}>
        {segments.map((segment, index) => {
          const value =
            Number.isFinite(segment.value) && segment.value > 0
              ? segment.value
              : 0;
          const color =
            theme.category[
              segment.color ??
                usageColorSequence[index % usageColorSequence.length]
            ];
          return (
            <div
              key={segment.id}
              style={{
                width: `${(value / safeTotal) * 100}%`,
                background: color,
                borderRadius: 3,
              }}
            />
          );
        })}
        {remainder > 0 && (
          <div
            style={{
              width: `${(remainder / safeTotal) * 100}%`,
              background: theme.fill.tertiary,
              borderRadius: 3,
            }}
          />
        )}
      </div>
    </div>
  );
}

export function CollapsibleSection({
  title,
  leading,
  count,
  trailing,
  children,
  defaultOpen = false,
  style,
}: CollapsibleSectionProps) {
  const theme = useHostTheme();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={style}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 0',
          cursor: 'pointer',
          userSelect: 'none',
          color: theme.text.primary,
          fontSize: 14,
        }}
      >
        <Chevron expanded={open} />
        {leading}
        <span style={{ fontWeight: 500 }}>{title}</span>
        {count != null && (
          <span style={{ color: theme.text.tertiary, fontSize: 12 }}>
            {count}
          </span>
        )}
        <span style={{ flex: 1 }} />
        {trailing != null && (
          <span style={{ color: theme.text.tertiary }}>{trailing}</span>
        )}
      </div>
      {open && (
        <div style={{ paddingLeft: 18, paddingBottom: 4 }}>{children}</div>
      )}
    </div>
  );
}
