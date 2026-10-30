import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Node 25+ may install a stub `localStorage` that is not a Storage (no clear/getItem).
if (
	typeof localStorage === 'undefined' ||
  typeof localStorage.clear !== 'function'
) {
	const store = new Map<string, string>()
	const memoryStorage: Storage = {
		get length() {
			return store.size
		},
		clear: () => store.clear(),
		getItem: key => store.get(key) ?? null,
		key: index => [...store.keys()][index] ?? null,
		removeItem: (key) => {
			store.delete(key)
		},
		setItem: (key, value) => {
			store.set(key, String(value))
		},
	}
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		value: memoryStorage,
	})
}

afterEach(() => {
	cleanup()
	localStorage.clear()
})

// jsdom lacks these APIs that Mantine + Recharts rely on.
if (!window.matchMedia) {
	window.matchMedia = ((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: () => {},
		removeEventListener: () => {},
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
	})) as typeof window.matchMedia
}

/** Default size for chart containers in jsdom (Recharts needs non-zero layout). */
const TEST_LAYOUT_WIDTH = 640
const TEST_LAYOUT_HEIGHT = 320

class ResizeObserverMock {
	private readonly callback: ResizeObserverCallback

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback
	}

	observe(target: Element): void {
		if (target instanceof HTMLElement) {
			Object.defineProperty(target, 'clientWidth', {
				configurable: true,
				value: TEST_LAYOUT_WIDTH,
			})
			Object.defineProperty(target, 'clientHeight', {
				configurable: true,
				value: TEST_LAYOUT_HEIGHT,
			})
		}
		const contentRect: DOMRectReadOnly = {
			x: 0,
			y: 0,
			width: TEST_LAYOUT_WIDTH,
			height: TEST_LAYOUT_HEIGHT,
			top: 0,
			left: 0,
			right: TEST_LAYOUT_WIDTH,
			bottom: TEST_LAYOUT_HEIGHT,
			toJSON: () => ({}),
		}
		const box = {
			inlineSize: TEST_LAYOUT_WIDTH,
			blockSize: TEST_LAYOUT_HEIGHT,
		}
		this.callback(
			[
				{
					target,
					contentRect,
					borderBoxSize: [box],
					contentBoxSize: [box],
					devicePixelContentBoxSize: [box],
				} as ResizeObserverEntry,
			],
			this,
		)
	}

	unobserve(): void {}

	disconnect(): void {}
}

globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver
