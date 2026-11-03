import { Checkbox as MantineCheckbox, Select as MantineSelect, Textarea as MantineTextarea, TextInput as MantineTextInput, Switch } from '@mantine/core'
import type { CheckboxProps, SelectProps, TextAreaProps, TextInputProps, ToggleProps } from '../../vendor/canvas-sdk/form-primitives.js'

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
				if (next !== null) onChange?.(next)
			}}
			style={style}
		/>
	)
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
			onChange={event => onChange?.(event.currentTarget.checked)}
			style={style}
		/>
	)
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
			onChange={event => onChange?.(event.currentTarget.checked)}
			style={style}
		/>
	)
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
			onChange={event => onChange?.(event.currentTarget.value)}
			style={style}
		/>
	)
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
			onChange={event => onChange?.(event.currentTarget.value)}
			style={style}
		/>
	)
}
