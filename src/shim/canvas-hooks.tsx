import { useCallback, useState, type CSSProperties } from 'react'
import type { CanvasAction, SetCanvasState } from '../vendor/canvas-sdk/hooks.js'

export function useCanvasState<T>(
  key: string,
  defaultValue: T,
): [T, SetCanvasState<T>] {
  const storageKey = `canvas:${key}`

  const [state, setState] = useState<T>(() => {
    if (typeof localStorage === 'undefined') return defaultValue
    try {
      const raw = localStorage.getItem(storageKey)
      return raw === null ? defaultValue : (JSON.parse(raw) as T)
    } catch {
      return defaultValue
    }
  })

  const set = useCallback<SetCanvasState<T>>(
    (action) => {
      setState((prev) => {
        const next =
          typeof action === 'function'
            ? (action as (prev: T) => T)(prev)
            : action
        try {
          localStorage?.setItem(storageKey, JSON.stringify(next))
        } catch {
          // Ignore quota / unavailable storage; state still updates in memory.
        }
        return next
      })
    },
    [storageKey],
  )

  return [state, set]
}

export function useCanvasAction(): (action: CanvasAction) => void {
  return useCallback((action: CanvasAction) => {
    if (import.meta.env?.DEV) {
      console.info(
        '[cursor/canvas shim] useCanvasAction (no-op on web):',
        action,
      )
    }
  }, [])
}

export function mergeStyle(
  base: CSSProperties,
  override?: CSSProperties,
): CSSProperties {
  return { ...base, ...override }
}
