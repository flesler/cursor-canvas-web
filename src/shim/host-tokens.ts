/**
 * Runtime mirror of vendored `canvas-tokens.d.ts` + `theme.d.ts` token helpers.
 */
import type { CanvasHostTheme } from '../vendor/canvas-sdk/hooks.js'
import type { CanvasHostThemeBrand, CanvasHostThemeOverrides, CanvasPalette, CanvasTokens, CategoryPalette, Color } from '../vendor/canvas-sdk/canvas-tokens.js'
import type { CanvasRadius, CanvasTypography } from '../vendor/canvas-sdk/theme.js'

export type {
	CanvasHostThemeBrand,
	CanvasHostThemeOverrides,
	CanvasPalette,
	CanvasTokens,
	CategoryPalette,
	Color,
} from '../vendor/canvas-sdk/canvas-tokens.js'

export const canvasPaletteDark: CanvasPalette = {
	foreground: '#E4E4E4EB',
	foregroundSecondary: '#E4E4E48D',
	foregroundTertiary: '#E4E4E45E',
	foregroundQuaternary: '#E4E4E442',
	editor: '#181818',
	chrome: '#141414',
	sidebar: '#141414',
	elevated: '#181818',
	fillPrimary: '#E4E4E430',
	fillSecondary: '#E4E4E41E',
	fillTertiary: '#E4E4E411',
	fillQuaternary: '#E4E4E40A',
	strokePrimary: '#E4E4E433',
	strokeSecondary: '#E4E4E41F',
	strokeTertiary: '#E4E4E414',
	strokeFocused: '#599CE7',
	accent: '#599CE7',
	buttonBackground: '#599CE7',
	buttonForeground: '#191c22',
	buttonHoverBackground: '#6AABE9',
	link: '#87c3ff',
	diffInsertedLine: '#3FA26633',
	diffRemovedLine: '#B8004933',
	diffStripAdded: '#3FA2668F',
	diffStripRemoved: '#FC6B838F',
}

export const canvasPaletteLight: CanvasPalette = {
	foreground: '#141414F0',
	foregroundSecondary: '#141414BD',
	foregroundTertiary: '#1414148A',
	foregroundQuaternary: '#1414145C',
	editor: '#FCFCFC',
	chrome: '#F8F8F8',
	sidebar: '#F3F3F3',
	elevated: '#FCFCFC',
	fillPrimary: '#14141433',
	fillSecondary: '#14141424',
	fillTertiary: '#14141414',
	fillQuaternary: '#1414140F',
	strokePrimary: '#14141433',
	strokeSecondary: '#1414141F',
	strokeTertiary: '#14141414',
	strokeFocused: '#3685BF',
	accent: '#3685BF',
	buttonBackground: '#3685BF',
	buttonForeground: '#FCFCFC',
	buttonHoverBackground: '#2E76AB',
	link: '#3685BF',
	diffInsertedLine: '#1F8A651F',
	diffRemovedLine: '#CF2D5614',
	diffStripAdded: '#1F8A65CC',
	diffStripRemoved: '#CF2D56CC',
}

const grokAccentDark = {
	accent: '#1084FE',
	buttonBackground: '#1084FE',
	buttonForeground: '#070707',
	buttonHoverBackground: '#459FFE',
	link: '#80BEFE',
	strokeFocused: '#1084FE',
} as const

const grokAccentLight = {
	accent: '#0C64C1',
	buttonBackground: '#0C64C1',
	buttonForeground: '#FAFAFA',
	buttonHoverBackground: '#1084FE',
	link: '#0C64C1',
	strokeFocused: '#0C64C1',
} as const

export const canvasPaletteGrokDark: CanvasPalette = {
	...canvasPaletteDark,
	...grokAccentDark,
}

export const canvasPaletteGrokLight: CanvasPalette = {
	...canvasPaletteLight,
	...grokAccentLight,
}

export const categoryPaletteDark: CategoryPalette = {
	gray: '#8888A8E0',
	purple: '#7B64B8F0',
	green: '#1F8A65E8',
	yellow: '#E8C030E0',
	cyan: '#2A9A8AE0',
	pink: '#C85898E0',
	blue: '#2E79B5E0',
	orange: '#F0A040E0',
	red: '#C04848E0',
}

export const categoryPaletteLight: CategoryPalette = {
	gray: '#8888A8E0',
	purple: '#7B64B8F0',
	green: '#1F8A65E8',
	yellow: '#E8C030E0',
	cyan: '#2A9A8AE0',
	pink: '#C85898E0',
	blue: '#2E79B5E0',
	orange: '#F0A088E0',
	red: '#CF2D56E0',
}

export const categoryPaletteGrokDark: CategoryPalette = {
	gray: '#777777E0',
	purple: '#9159FEF0',
	green: '#00C972E8',
	yellow: '#FF9800E0',
	cyan: '#00BCA6E0',
	pink: '#FF309BE0',
	blue: '#1084FEE0',
	orange: '#FF6700E0',
	red: '#FF263CE0',
}

export const categoryPaletteGrokLight: CategoryPalette = {
	...categoryPaletteGrokDark,
}

export const colorPalette = categoryPaletteDark

export const usageColorSequence: readonly Color[] = [
	'blue',
	'purple',
	'green',
	'yellow',
	'cyan',
	'pink',
	'orange',
	'red',
	'gray',
]

export const chartPalette = {
	green: '#1F8A65E8',
	darkGreen: '#0D855AE0',
	lightGreen: '#52B896E0',
	mintGreen: '#7DCAB0E0',
	blue: '#2E79B5E0',
	lightBlue: '#70B0D8E0',
	indigo: '#5A6CC0F0',
	lightIndigo: '#9AAADCE0',
	purple: '#7B64B8F0',
	lightPurple: '#AA98D8E0',
	warmPink: '#C85898E0',
	lightPink: '#E8A0C4E0',
	brightOrange: '#F0A040E0',
	deepOrange: '#C06028E0',
	goldenYellow: '#E8C030E0',
	darkAmber: '#C04848E0',
	warmPeach: '#F0A088E0',
	vibrantTeal: '#2A9A8AE0',
	muted: '#8888A8E0',
	neutralLine: '#888899D0',
} as const

export type ChartPalette = typeof chartPalette

export const chartPaletteGrok = {
	green: '#00C972E8',
	darkGreen: '#009957E0',
	lightGreen: '#38D591E0',
	mintGreen: '#78E2B4E0',
	blue: '#1084FEE0',
	lightBlue: '#459FFEE0',
	indigo: '#0C64C1F0',
	lightIndigo: '#80BEFEE0',
	purple: '#9159FEF0',
	lightPurple: '#A97EFEE0',
	warmPink: '#FF309BE0',
	lightPink: '#FF5EB1E0',
	brightOrange: '#FF6700E0',
	deepOrange: '#C24E00E0',
	goldenYellow: '#FF9800E0',
	darkAmber: '#FF263CE0',
	warmPeach: '#FF8838E0',
	vibrantTeal: '#00BCA6E0',
	muted: '#777777E0',
	neutralLine: '#777777D0',
} as const

export const chartColorSequence: readonly string[] = [
	chartPalette.green,
	chartPalette.lightBlue,
	chartPalette.indigo,
	chartPalette.brightOrange,
	chartPalette.deepOrange,
	chartPalette.goldenYellow,
	chartPalette.warmPink,
	chartPalette.warmPeach,
	chartPalette.purple,
	chartPalette.mintGreen,
	chartPalette.muted,
	chartPalette.vibrantTeal,
]

export const chartColorSequenceGrok: readonly string[] = [
	chartPaletteGrok.green,
	chartPaletteGrok.lightBlue,
	chartPaletteGrok.indigo,
	chartPaletteGrok.brightOrange,
	chartPaletteGrok.deepOrange,
	chartPaletteGrok.goldenYellow,
	chartPaletteGrok.warmPink,
	chartPaletteGrok.warmPeach,
	chartPaletteGrok.purple,
	chartPaletteGrok.mintGreen,
	chartPaletteGrok.muted,
	chartPaletteGrok.vibrantTeal,
]

export const canvasTypography = {
	fontFamily: 'inherit' as const,
	h1: { fontSize: '24px', lineHeight: '30px', fontWeight: 590 },
	h2: { fontSize: '18px', lineHeight: '24px', fontWeight: 590 },
	h3: { fontSize: '16px', lineHeight: '22px', fontWeight: 590 },
	body: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
	small: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
}

export const canvasFontFamilyCursor = 'inherit' as const

export const canvasFontFamilyGrok =
	'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

export const canvasSpacing = {
	'0.5': 2,
	'1': 4,
	'1.5': 6,
	'2': 8,
	'2.5': 10,
	'3': 12,
	'3.5': 14,
	'4': 16,
	'4.5': 18,
	'5': 20,
	'6': 24,
	'7': 28,
	'8': 32,
	'9': 36,
	'10': 40,
} as const

export const canvasRadius = {
	none: 0,
	xs: 2,
	sm: 4,
	md: 6,
	lg: 8,
	xl: 12,
	full: 9999,
} as const

export const canvasRadiusGrok: CanvasRadius = {
	...canvasRadius,
	md: 8,
	lg: 10,
	xl: 14,
}

export const canvasTypographyGrok: CanvasTypography = {
	...canvasTypography,
	fontFamily: canvasFontFamilyGrok,
}

function tokensFromPalette(
	palette: CanvasPalette,
	category: CategoryPalette,
): CanvasTokens {
	return {
		bg: {
			editor: palette.editor,
			chrome: palette.chrome,
			elevated: palette.elevated,
		},
		text: {
			primary: palette.foreground,
			secondary: palette.foregroundSecondary,
			tertiary: palette.foregroundTertiary,
			quaternary: palette.foregroundQuaternary,
			link: palette.link,
			onAccent: palette.buttonForeground,
		},
		stroke: {
			primary: palette.strokePrimary,
			secondary: palette.strokeSecondary,
			tertiary: palette.strokeTertiary,
			focused: palette.strokeFocused,
		},
		fill: {
			primary: palette.fillPrimary,
			secondary: palette.fillSecondary,
			tertiary: palette.fillTertiary,
			quaternary: palette.fillQuaternary,
		},
		accent: {
			primary: palette.accent,
			control: palette.buttonBackground,
			controlHover: palette.buttonHoverBackground,
		},
		diff: {
			insertedLine: palette.diffInsertedLine,
			removedLine: palette.diffRemovedLine,
			stripAdded: palette.diffStripAdded,
			stripRemoved: palette.diffStripRemoved,
		},
		category,
	}
}

export const canvasTokens = tokensFromPalette(
	canvasPaletteDark,
	categoryPaletteDark,
)
export const canvasTokensLight = tokensFromPalette(
	canvasPaletteLight,
	categoryPaletteLight,
)

export function parseHexColor(value: string): { r: number; g: number; b: number } | undefined {
	const trimmed = value.trim()
	const match = /^#([0-9a-f]{3,8})$/i.exec(trimmed)
	if (!match) {
		return undefined
	}
	const hex = match[1]
	if (hex.length === 3 || hex.length === 4) {
		const expand = (c: string) => c + c
		const r = parseInt(expand(hex[0]), 16)
		const g = parseInt(expand(hex[1]), 16)
		const b = parseInt(expand(hex[2]), 16)
		return { r, g, b }
	}
	if (hex.length === 6 || hex.length === 8) {
		const r = parseInt(hex.slice(0, 2), 16)
		const g = parseInt(hex.slice(2, 4), 16)
		const b = parseInt(hex.slice(4, 6), 16)
		return { r, g, b }
	}
	return undefined
}

function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
	const channel = (c: number) => {
		const s = c / 255
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
	}
	return (
		0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
	)
}

function mixRgb(
	a: { r: number; g: number; b: number },
	b: { r: number; g: number; b: number },
	weightB: number,
): { r: number; g: number; b: number } {
	const w = Math.min(1, Math.max(0, weightB))
	return {
		r: Math.round(a.r * (1 - w) + b.r * w),
		g: Math.round(a.g * (1 - w) + b.g * w),
		b: Math.round(a.b * (1 - w) + b.b * w),
	}
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
	const part = (n: number) => n.toString(16).padStart(2, '0')
	return `#${part(rgb.r)}${part(rgb.g)}${part(rgb.b)}`
}

export function parseCanvasHostThemeBrand(
	value: unknown,
): CanvasHostThemeBrand {
	return value === 'grok' ? 'grok' : 'cursor'
}

export function applyWorkbenchSurfaces(
	palette: CanvasPalette,
	surfaces: Pick<
		CanvasHostThemeOverrides,
    'editorBackground' | 'editorForeground'
	>,
): CanvasPalette {
	let next = palette
	if (
		typeof surfaces.editorBackground === 'string' &&
    parseHexColor(surfaces.editorBackground)
	) {
		const bg = surfaces.editorBackground
		next = {
			...next,
			editor: bg,
			chrome: bg,
			sidebar: bg,
			elevated: bg,
		}
	}
	if (
		typeof surfaces.editorForeground === 'string' &&
    parseHexColor(surfaces.editorForeground)
	) {
		const fg = surfaces.editorForeground
		next = {
			...next,
			foreground: fg,
			foregroundSecondary: fg,
			foregroundTertiary: fg,
			foregroundQuaternary: fg,
		}
	}
	return next
}

export function applyPrimaryColor(
	palette: CanvasPalette,
	primary: string,
): CanvasPalette {
	const rgb = parseHexColor(primary)
	if (!rgb) {
		return palette
	}
	const hover = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.12)
	const onAccent =
		relativeLuminance(rgb) > 0.45 ? '#141414' : '#FAFAFA'
	return {
		...palette,
		accent: primary,
		buttonBackground: primary,
		buttonHoverBackground: rgbToHex(hover),
		link: primary,
		strokeFocused: primary,
		buttonForeground: onAccent,
	}
}

const LIGHT_KINDS = new Set(['light', 'hc-light'])

function isLightKind(kind: string): boolean {
	return LIGHT_KINDS.has(kind)
}

export function buildHostTokens(
	kind: string,
	overrides?: CanvasHostThemeOverrides,
): {
	tokens: CanvasTokens;
	palette: CanvasPalette;
	brand: CanvasHostThemeBrand
} {
	const brand = parseCanvasHostThemeBrand(overrides?.brand)
	const light = isLightKind(kind)
	let palette: CanvasPalette
	let category: CategoryPalette
	if (brand === 'grok') {
		palette = light ? canvasPaletteGrokLight : canvasPaletteGrokDark
		category = light ? categoryPaletteGrokLight : categoryPaletteGrokDark
	} else {
		palette = light ? canvasPaletteLight : canvasPaletteDark
		category = light ? categoryPaletteLight : categoryPaletteDark
	}
	palette = applyWorkbenchSurfaces(palette, overrides ?? {})
	if (brand !== 'grok' && typeof overrides?.primary === 'string') {
		palette = applyPrimaryColor(palette, overrides.primary)
	}
	const tokens = tokensFromPalette(palette, category)
	return { tokens, palette, brand }
}

export function chartThemeForBrand(brand: CanvasHostThemeBrand): {
	palette: ChartPalette;
	sequence: readonly string[]
} {
	if (brand === 'grok') {
		return {
			palette: chartPaletteGrok as unknown as ChartPalette,
			sequence: chartColorSequenceGrok,
		}
	}
	return { palette: chartPalette, sequence: chartColorSequence }
}

export function canvasRadiusForBrand(
	brand: CanvasHostThemeBrand,
): CanvasRadius {
	return brand === 'grok' ? canvasRadiusGrok : canvasRadius
}

export function canvasTypographyForBrand(
	brand: CanvasHostThemeBrand,
): CanvasTypography {
	return brand === 'grok' ? canvasTypographyGrok : canvasTypography
}

export type ShimHostTheme = CanvasHostTheme & {
	readonly category: CategoryPalette;
	readonly spacing: typeof canvasSpacing
}

type RawHostThemeState = {
	readonly kind?: unknown;
	readonly brand?: unknown;
	readonly primary?: unknown;
	readonly editorBackground?: unknown;
	readonly editorForeground?: unknown
}

function readHostThemeRaw(): RawHostThemeState | undefined {
	if (typeof window === 'undefined') {
		return undefined
	}
	const bridge = (window as Window & { __cursorCanvas?: { state?: { theme?: RawHostThemeState } } })
		.__cursorCanvas
	return bridge?.state?.theme
}

export function resolveTheme(
	raw: RawHostThemeState | undefined,
	fallbackKind?: 'light' | 'dark',
): ShimHostTheme {
	let kind =
		typeof raw?.kind === 'string' && raw.kind.length > 0
			? raw.kind
			: undefined
	if (!kind) {
		if (fallbackKind) {
			kind = fallbackKind
		} else if (typeof window !== 'undefined' && window.matchMedia) {
			kind = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
		} else {
			kind = 'dark'
		}
	}
	const overrides: CanvasHostThemeOverrides = {
		brand: parseCanvasHostThemeBrand(raw?.brand),
		primary:
      typeof raw?.primary === 'string' ? raw.primary : undefined,
		editorBackground:
      typeof raw?.editorBackground === 'string'
      	? raw.editorBackground
      	: undefined,
		editorForeground:
      typeof raw?.editorForeground === 'string'
      	? raw.editorForeground
      	: undefined,
	}
	const { tokens, palette, brand } = buildHostTokens(kind, overrides)
	const chart = chartThemeForBrand(brand)
	return {
		...tokens,
		kind,
		brand,
		tokens,
		palette,
		category: tokens.category,
		radius: canvasRadiusForBrand(brand),
		typography: canvasTypographyForBrand(brand),
		chart,
		spacing: canvasSpacing,
	}
}

export function resolveThemeForColorScheme(
	scheme: 'light' | 'dark',
): ShimHostTheme {
	const host = readHostThemeRaw()
	return resolveTheme(host, scheme)
}
