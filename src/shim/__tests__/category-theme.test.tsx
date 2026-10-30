import { renderHook } from '@testing-library/react'
import { Swatch, UsageBar, useHostTheme } from 'cursor/canvas'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithProvider } from '../../test/render'
import { CanvasMantineRoot } from '../canvas-mantine-root'

function schemeWrapper(scheme: 'light' | 'dark') {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<CanvasMantineRoot defaultColorScheme={scheme}>
				{children}
			</CanvasMantineRoot>
		)
	}
}

describe('category colors on host theme', () => {
	it('exposes category on the host theme root and under tokens', () => {
		const { result } = renderHook(() => useHostTheme(), {
			wrapper: schemeWrapper('dark'),
		})
		const theme = result.current
		expect(Object.keys(theme)).toContain('category')
		expect(theme.tokens.category).toBe(theme.category)
		expect(theme.category.gray).toBe(theme.text.tertiary)
	})

	it('Swatch gray follows the active color scheme', () => {
		const darkBg = renderWithProvider(<Swatch color="gray" />, 'dark')
			.container.querySelector('span')?.style.background
		const lightBg = renderWithProvider(<Swatch color="gray" />, 'light')
			.container.querySelector('span')?.style.background
		expect(darkBg).toBeTruthy()
		expect(lightBg).toBeTruthy()
		expect(darkBg).not.toBe(lightBg)
	})

	it('UsageBar segment matches Swatch for the same hue', () => {
		const { container } = renderWithProvider(
			<>
				<Swatch color="purple" />
				<UsageBar
					total={1}
					segments={[{ id: 'a', value: 1, color: 'purple' }]}
				/>
			</>,
		)
		const swatchBg = container.querySelector('span')?.style.background
		const segment = Array.from(
			container.querySelectorAll<HTMLElement>('div'),
		).find(
			el => el.style.borderRadius === '3px' && el.style.width === '100%',
		)?.style.background
		expect(swatchBg).toBeTruthy()
		expect(segment).toBe(swatchBg)
	})
})
