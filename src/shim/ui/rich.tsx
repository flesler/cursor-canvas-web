import { useState } from 'react'
import type { CollapsibleSectionProps } from '../../vendor/canvas-sdk/collapsible-section.js'
import type { SwatchProps } from '../../vendor/canvas-sdk/swatch.js'
import type { UsageBarProps } from '../../vendor/canvas-sdk/usage-bar.js'
import { usageColorSequence } from '../theme'
import { useHostTheme } from '../use-tokens'
import { Chevron } from './chevron'

export function Swatch({ color, style }: SwatchProps) {
	const theme = useHostTheme()
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
	)
}

export function UsageBar({
	segments,
	total,
	topLeftLabel,
	topRightLabel,
	style,
}: UsageBarProps) {
	const theme = useHostTheme()
	const safeTotal = total > 0 ? total : 1
	const used = segments.reduce(
		(sum, s) => sum + (Number.isFinite(s.value) && s.value > 0 ? s.value : 0),
		0,
	)
	const remainder = Math.max(0, safeTotal - used)
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
							: 0
					const color =
						theme.category[
							segment.color ??
                usageColorSequence[index % usageColorSequence.length]
						]
					return (
						<div
							key={segment.id}
							style={{
								width: `${(value / safeTotal) * 100}%`,
								background: color,
								borderRadius: 3,
							}}
						/>
					)
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
	)
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
	const theme = useHostTheme()
	const [open, setOpen] = useState(defaultOpen)
	return (
		<div style={style}>
			<div
				onClick={() => setOpen(o => !o)}
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
	)
}
