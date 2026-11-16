import { Checkbox as MantineCheckbox, Select as MantineSelect, Textarea as MantineTextarea, TextInput as MantineTextInput, Switch } from '@mantine/core'
import type { CheckboxProps, SelectProps, TextAreaProps, TextInputProps, ToggleProps } from '../../superset/shim-props.js'

export function Select({
  value,
  onChange,
  options,
  style,
  ...rest
}: SelectProps) {
  return (
    <MantineSelect
      {...rest}
      value={value}
      data={options}
      allowDeselect={false}
      onChange={(next) => {
        if (next !== null) onChange?.(next)
      }}
      style={style}
    />
  )
}

export function Checkbox({
  checked,
  onChange,
  style,
  ...rest
}: CheckboxProps) {
  return (
    <MantineCheckbox
      {...rest}
      checked={checked}
      onChange={event => onChange?.(event.currentTarget.checked)}
      style={style}
    />
  )
}

export function Toggle({
  checked,
  onChange,
  size = 'sm',
  style,
  ...rest
}: ToggleProps) {
  return (
    <Switch
      {...rest}
      checked={checked}
      size={size === 'sm' ? 'sm' : 'md'}
      onChange={event => onChange?.(event.currentTarget.checked)}
      style={style}
    />
  )
}

export function TextInput({
  value,
  onChange,
  style,
  ...rest
}: TextInputProps) {
  return (
    <MantineTextInput
      {...rest}
      value={value}
      onChange={event => onChange?.(event.currentTarget.value)}
      style={style}
    />
  )
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  style,
  ...rest
}: TextAreaProps) {
  return (
    <MantineTextarea
      {...rest}
      value={value}
      autosize
      minRows={rows}
      onChange={event => onChange?.(event.currentTarget.value)}
      style={style}
    />
  )
}