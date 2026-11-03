import { Alert, Badge, Text as MantineText } from '@mantine/core'
import type { CalloutProps, PillProps, StatProps } from '../../vendor/canvas-sdk/ui-primitives.js'
import { toneColor, toneHex } from '../theme'
import { useHostTheme } from '../use-tokens'

export function Stat({ value, label, tone, style }: StatProps) {
  const host = useHostTheme()
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
  )
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
  )
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
  )
}
