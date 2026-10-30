import { afterEach, describe, expect, it } from 'vitest'
import { applyPrimaryColor, buildHostTokens, canvasPaletteDark, canvasPaletteGrokDark, canvasPaletteLight, categoryPaletteDark, categoryPaletteLight, chartThemeForBrand, colorPalette, parseCanvasHostThemeBrand, resolveThemeForColorScheme, type Color } from '../host-tokens'

const CATEGORY_HUES: readonly Color[] = [
	'gray',
	'purple',
	'green',
	'yellow',
	'cyan',
	'pink',
	'blue',
	'orange',
	'red',
]

describe('host-tokens', () => {
	afterEach(() => {
		delete (window as Window & { __cursorCanvas?: unknown }).__cursorCanvas
	})

	it('parseCanvasHostThemeBrand defaults unknown to cursor', () => {
		expect(parseCanvasHostThemeBrand('grok')).toBe('grok')
		expect(parseCanvasHostThemeBrand('sand')).toBe('cursor')
		expect(parseCanvasHostThemeBrand(undefined)).toBe('cursor')
	})

	it('buildHostTokens keeps Grok inks when primary is sent', () => {
		const { palette, brand } = buildHostTokens('dark', {
			brand: 'grok',
			primary: '#ff00ff',
		})
		expect(brand).toBe('grok')
		expect(palette.buttonForeground).toBe(canvasPaletteGrokDark.buttonForeground)
		expect(palette.accent).toBe(canvasPaletteGrokDark.accent)
	})

	it('buildHostTokens applies primary overlay for cursor brand', () => {
		const { palette } = buildHostTokens('dark', {
			brand: 'cursor',
			primary: '#ff6600',
		})
		expect(palette.accent).toBe('#ff6600')
		expect(palette.buttonBackground).toBe('#ff6600')
	})

	it('chartThemeForBrand returns Grok chart colors', () => {
		const grok = chartThemeForBrand('grok')
		const cursor = chartThemeForBrand('cursor')
		expect(grok.palette.blue).toBe('#1084FEE0')
		expect(cursor.palette.blue).toBe('#2E79B5E0')
		expect(grok.sequence[0]).not.toBe(cursor.sequence[0])
	})

	it('resolveTheme reads IDE bridge brand', () => {
		(window as Window & { __cursorCanvas?: { state: { theme: object } } })
			.__cursorCanvas = {
				state: {
					theme: { kind: 'dark', brand: 'grok' },
				},
			}
		const theme = resolveThemeForColorScheme('dark')
		expect(theme.brand).toBe('grok')
		expect(theme.chart.palette.blue).toBe('#1084FEE0')
		expect(theme.radius.md).toBe(8)
		expect(theme.typography.fontFamily).toContain('ui-sans-serif')
	})

	it('applyPrimaryColor ignores invalid hex', () => {
		const base = buildHostTokens('dark', {}).palette
		expect(applyPrimaryColor(base, 'not-a-color')).toBe(base)
	})

	describe('category palette', () => {
		it('uses foregroundTertiary for gray on static exports', () => {
			expect(categoryPaletteDark.gray).toBe(
				canvasPaletteDark.foregroundTertiary,
			)
			expect(categoryPaletteLight.gray).toBe(
				canvasPaletteLight.foregroundTertiary,
			)
			expect(categoryPaletteDark.gray).not.toBe(categoryPaletteLight.gray)
		})

		it('keeps colorPalette as the dark table alias', () => {
			expect(colorPalette).toBe(categoryPaletteDark)
		})

		it.each(CATEGORY_HUES)(
			'buildHostTokens resolves category.%s in dark and light',
			(hue) => {
				const dark = buildHostTokens('dark', {}).tokens.category[hue]
				const light = buildHostTokens('light', {}).tokens.category[hue]
				expect(dark).toMatch(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)
				expect(light).toMatch(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)
			},
		)

		it('recomputes category gray after workbench foreground override', () => {
			const { tokens } = buildHostTokens('dark', {
				editorForeground: '#aabbcc',
			})
			expect(tokens.category.gray).toBe('#aabbcc')
			expect(tokens.text.tertiary).toBe(tokens.category.gray)
		})
	})
})
