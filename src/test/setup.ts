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

class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverMock as typeof ResizeObserver
