import { ActionIcon, Button as MantineButton } from '@mantine/core'
import type { IconButtonProps } from '../../superset/shim-props.js'
import type { ButtonProps } from '../../superset/shim-props.js'

const BUTTON_VARIANT = {
  primary: 'filled',
  secondary: 'default',
  ghost: 'subtle',
} as const

export function Button({
  children,
  variant = 'secondary',
  style,
  ...rest
}: ButtonProps) {
  return (
    <MantineButton
      {...rest}
      variant={BUTTON_VARIANT[variant]}
      color={variant === 'primary' ? 'accent' : undefined}
      size="xs"
      style={style}
    >
      {children}
    </MantineButton>
  )
}

export function IconButton({
  children,
  variant = 'default',
  size = 'md',
  title,
  style,
  ...rest
}: IconButtonProps) {
  return (
    <ActionIcon
      {...rest}
      variant={variant === 'circle' ? 'light' : 'subtle'}
      radius={variant === 'circle' ? 'xl' : 'sm'}
      size={size === 'sm' ? 'sm' : 'md'}
      color="gray"
      title={title}
      aria-label={title}
      style={style}
    >
      {children}
    </ActionIcon>
  )
}