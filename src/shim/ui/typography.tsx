import { Text as MantineText, Title } from '@mantine/core'
import { createContext, useContext, type CSSProperties } from 'react'
import type { CodeProps, H1Props, H2Props, H3Props, LinkProps, TextProps, TextWeight } from '../../vendor/canvas-sdk/ui-primitives.js'
import { useHostTheme } from '../use-tokens'

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
	const host = useHostTheme()
	return (
		<Title order={1} style={headingStyle(host, 'h1', style)}>
			{children}
		</Title>
	)
}

export function H2({ children, style }: H2Props) {
	const host = useHostTheme()
	return (
		<Title order={2} style={headingStyle(host, 'h2', style)}>
			{children}
		</Title>
	)
}

export function H3({ children, style }: H3Props) {
	const host = useHostTheme()
	return (
		<Title order={3} style={headingStyle(host, 'h3', style)}>
			{children}
		</Title>
	)
}

const TEXT_WEIGHT: Record<TextWeight, number> = {
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
}

const TextParentContext = createContext(false)

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
	const theme = useHostTheme()
	const nestedInText = useContext(TextParentContext)
	const component = nestedInText && as === 'p' ? 'span' : as
	const blockParagraph = as === 'p'
	return (
		<TextParentContext.Provider value={true}>
			<MantineText
				component={component}
				size={size === 'small' ? 'xs' : 'sm'}
				fw={TEXT_WEIGHT[weight]}
				c={tone === 'primary' ? undefined : theme.text[tone]}
				truncate={truncate}
				style={{
					fontStyle: italic ? 'italic' : undefined,
					...(tone === 'primary' ? { color: theme.text.primary } : undefined),
					...(blockParagraph && component === 'span'
						? { display: 'block' }
						: undefined),
					fontFamily: theme.typography.fontFamily,
					...style,
				}}
			>
				{children}
			</MantineText>
		</TextParentContext.Provider>
	)
}

export function Code({ children, style }: CodeProps) {
	const host = useHostTheme()
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
	)
}

export function Link({ children, href, style }: LinkProps) {
	const host = useHostTheme()
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			style={{ color: host.text.link, ...style }}
		>
			{children}
		</a>
	)
}
