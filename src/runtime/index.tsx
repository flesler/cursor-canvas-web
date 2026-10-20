/**
 * Web host runtime for canvases.
 *
 * This is intentionally a SEPARATE entry point from the `cursor/canvas` shim:
 * the shim must mirror the real SDK and invent no extra exports, whereas these
 * helpers are web-only glue (a Mantine provider + a mount helper) that replace
 * the boilerplate a consuming app would otherwise copy from `main.tsx`.
 *
 * Consumers must still import Mantine's stylesheets once in their app:
 *   import '@mantine/core/styles.css';
 *   import '@mantine/charts/styles.css';
 */
import { type MantineColorScheme } from '@mantine/core'
import { StrictMode, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CanvasMantineRoot } from '../shim/canvas-mantine-root'

export interface CanvasRootProps {
	children: ReactNode;
	/** Initial color scheme; defaults to following the OS preference. */
	defaultColorScheme?: MantineColorScheme
}

/** @deprecated Use `CanvasMantineRoot` — same behavior. */
export const CanvasRoot = CanvasMantineRoot

export interface MountCanvasOptions {
	defaultColorScheme?: MantineColorScheme;
	/** Skip `StrictMode` (e.g. for libraries that double-render badly). */
	strict?: boolean
}

/**
 * One-call entry for a standalone page: resolves the container (element or id),
 * mounts the canvas inside `CanvasMantineRoot`, and returns the React root so callers
 * can `unmount()` later.
 */
export function mountCanvas(
	container: HTMLElement | string,
	canvas: ReactNode,
	options: MountCanvasOptions = {},
): Root {
	const { defaultColorScheme = 'auto', strict = true } = options
	const element =
		typeof container === 'string'
			? document.getElementById(container)
			: container
	if (!element) {
		throw new Error(
			`mountCanvas: container ${
				typeof container === 'string' ? `#${container}` : ''
			} not found`,
		)
	}

	const root = createRoot(element)
	const tree = (
		<CanvasMantineRoot defaultColorScheme={defaultColorScheme}>
			{canvas}
		</CanvasMantineRoot>
	)
	root.render(strict ? <StrictMode>{tree}</StrictMode> : tree)
	return root
}
