import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCanvasState } from 'cursor/canvas'

describe('useCanvasState', () => {
  it('returns the initial value when storage is empty', () => {
    const { result } = renderHook(() => useCanvasState('count', 1))
    expect(result.current[0]).toBe(1)
  })

  it('persists updates to localStorage under the canvas namespace', () => {
    const { result } = renderHook(() => useCanvasState('count', 1))

    act(() => result.current[1](42))

    expect(result.current[0]).toBe(42)
    expect(localStorage.getItem('canvas:count')).toBe('42')
  })

  it('supports functional updates', () => {
    const { result } = renderHook(() => useCanvasState('count', 1))

    act(() => result.current[1](prev => prev + 9))

    expect(result.current[0]).toBe(10)
  })

  it('rehydrates a previously stored value on mount', () => {
    localStorage.setItem('canvas:flag', JSON.stringify(true))

    const { result } = renderHook(() => useCanvasState('flag', false))

    expect(result.current[0]).toBe(true)
  })

  it('falls back to __canvasJsonState when localStorage throws', () => {
    const storage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('sandboxed', 'SecurityError')
      },
    })
    ;(globalThis as { __canvasJsonState?: Record<string, unknown> }).__canvasJsonState = {
      label: 'from-sidecar',
    }

    const { result } = renderHook(() => useCanvasState('label', 'default'))

    expect(result.current[0]).toBe('from-sidecar')
    delete (globalThis as { __canvasJsonState?: Record<string, unknown> }).__canvasJsonState
    if (storage) {
      Object.defineProperty(globalThis, 'localStorage', storage)
    }
  })

  it('reads global __canvasJsonState when localStorage has no value', () => {
    ;(globalThis as { __canvasJsonState?: Record<string, unknown> }).__canvasJsonState = {
      label: 'from-sidecar',
    }

    const { result } = renderHook(() => useCanvasState('label', 'default'))

    expect(result.current[0]).toBe('from-sidecar')
    delete (globalThis as { __canvasJsonState?: Record<string, unknown> }).__canvasJsonState
  })
})
