import { afterEach, describe, expect, it } from 'vitest'
import { applyPrimaryColor, buildHostTokens, canvasPaletteGrokDark, chartThemeForBrand, parseCanvasHostThemeBrand, resolveThemeForColorScheme } from '../host-tokens'

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
})
