import { Card as MantineCard } from '@mantine/core'
import { useCallback, useContext, useState } from 'react'
import type { CardBodyProps, CardHeaderProps, CardProps } from '../../vendor/canvas-sdk/ui-primitives.js'
import { useHostTheme } from '../use-tokens'
import { CardContext } from './card-context'
import { Chevron } from './chevron'

export function Card({
	children,
	variant = 'default',
	collapsible = false,
	defaultOpen = true,
	open: openProp,
	onOpenChange,
	style,
}: CardProps) {
	const host = useHostTheme()
	const [internalOpen, setInternalOpen] = useState(defaultOpen)
	const open = openProp ?? internalOpen
	const toggle = useCallback(() => {
		const next = !open
		if (openProp === undefined) setInternalOpen(next)
		onOpenChange?.(next)
	}, [open, openProp, onOpenChange])

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
	)
}

export function CardHeader({ children, trailing, style }: CardHeaderProps) {
	const host = useHostTheme()
	const { collapsible, open, toggle } = useContext(CardContext)
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
				color: host.text.primary,
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
	)
}

export function CardBody({ children, style }: CardBodyProps) {
	const { collapsible, open } = useContext(CardContext)
	if (collapsible && !open) return null
	return <div style={{ padding: 14, ...style }}>{children}</div>
}
