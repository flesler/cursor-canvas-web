import { ActionIcon, Button as MantineButton } from '@mantine/core'
import type { IconButtonProps } from '../../vendor/canvas-sdk/form-primitives.js'
import type { ButtonProps } from '../../vendor/canvas-sdk/ui-primitives.js'

const BUTTON_VARIANT = {
  primary: 'filled',
  secondary: 'default',
  ghost: 'subtle',
} as const

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
  )
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
  )
}
