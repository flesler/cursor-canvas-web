import { Alert, Badge, Text as MantineText } from '@mantine/core'
import type { CalloutProps, PillProps, StatProps } from '../../superset/shim-props.js'
import { toneColor, toneHex } from '../theme'
import { useHostTheme } from '../use-tokens'

export function Stat({ value, label, tone, style, ...rest }: StatProps) {
  const host = useHostTheme()
  return (
    <div style={style} {...rest}>
      <MantineText
        fz={22}
        fw={700}
        lh={1.2}
        data-canvas-stat-value=""
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
  )
}

export function Pill({
  children,
  active,
  tone = 'neutral',
  size = 'md',
  leadingContent,
  keyboardHint,
  style,
  ...rest
}: PillProps) {
  return (
    <Badge
      {...rest}
      color={toneColor[tone]}
      variant={active ? 'filled' : 'light'}
      size={size === 'sm' ? 'sm' : 'md'}
      leftSection={leadingContent}
      rightSection={keyboardHint}
      style={{
        cursor: rest.onClick ? 'pointer' : undefined,
        textTransform: 'none',
        ...style,
      }}
    >
      {children}
    </Badge>
  )
}

export function Callout({
  children,
  tone = 'neutral',
  style,
  ...rest
}: CalloutProps) {
  return (
    <Alert
      {...rest}
      color={toneColor[tone]}
      variant="light"
      style={style}
    >
      {children}
    </Alert>
  )
}