import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { CanvasMantineRoot } from '../shim/canvas-mantine-root'

/** Render a tree inside the same provider the real app uses. */
export function renderWithProvider(
	ui: ReactNode,
	defaultColorScheme: 'light' | 'dark' = 'dark',
) {
	return render(
		<CanvasMantineRoot defaultColorScheme={defaultColorScheme}>
			{ui}
		</CanvasMantineRoot>,
	)
}
