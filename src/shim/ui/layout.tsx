import { Group, Divider as MantineDivider, Stack as MantineStack } from '@mantine/core'
import type { DividerProps, GridProps, RowProps, StackProps } from '../../vendor/canvas-sdk/ui-primitives.js'

export function Stack({ children, gap, style }: StackProps) {
	return (
		<MantineStack gap={gap} style={style}>
			{children}
		</MantineStack>
	)
}

const FLEX: Record<string, string> = {
	start: 'flex-start',
	center: 'center',
	end: 'flex-end',
	stretch: 'stretch',
	'space-between': 'space-between',
}

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
	)
}

export function Spacer() {
	return <div style={{ flex: 1 }} />
}

export function Grid({ children, columns, gap = 16, align, style }: GridProps) {
	const gridTemplateColumns =
		typeof columns === 'number'
			? `repeat(${columns}, minmax(0, 1fr))`
			: columns
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
	)
}

export function Divider({ style }: DividerProps) {
	return <MantineDivider style={style} />
}
