import { MantineProvider, createTheme, type MantineColorScheme, type MantineColorsTuple, type MantineThemeOverride } from '@mantine/core'
import { useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { resolveThemeForColorScheme, type ShimHostTheme } from './host-tokens'

export interface CanvasMantineRootProps {
  children: ReactNode;
  defaultColorScheme?: MantineColorScheme
}

function solidScale(hex: string): MantineColorsTuple {
  return [hex, hex, hex, hex, hex, hex, hex, hex, hex, hex]
}

/** Maps `useHostTheme()` / brand onto Mantine `theme` (primary, radii, headings). */
export function createMantineThemeFromHost(host: ShimHostTheme): MantineThemeOverride {
  const { typography: type, radius } = host
  return createTheme({
    primaryColor: 'accent',
    colors: {
      accent: solidScale(host.palette.accent),
    },
    fontFamily: type.fontFamily,
    defaultRadius: `${radius.md}`,
    radius: {
      xs: `${radius.xs}px`,
      sm: `${radius.sm}px`,
      md: `${radius.md}px`,
      lg: `${radius.lg}px`,
      xl: `${radius.xl}px`,
    },
    headings: {
      fontFamily: type.fontFamily,
      fontWeight: String(type.h1.fontWeight),
      sizes: {
        h1: {
          fontSize: type.h1.fontSize,
          lineHeight: type.h1.lineHeight,
          fontWeight: String(type.h1.fontWeight),
        },
        h2: {
          fontSize: type.h2.fontSize,
          lineHeight: type.h2.lineHeight,
          fontWeight: String(type.h2.fontWeight),
        },
        h3: {
          fontSize: type.h3.fontSize,
          lineHeight: type.h3.lineHeight,
          fontWeight: String(type.h3.fontWeight),
        },
        h4: {
          fontSize: type.body.fontSize,
          lineHeight: type.body.lineHeight,
          fontWeight: String(type.body.fontWeight),
        },
      },
    },
  })
}

function subscribeSystemScheme(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSystemScheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedPolarity(
  defaultColorScheme: MantineColorScheme,
): 'light' | 'dark' {
  const system = useSyncExternalStore<'light' | 'dark'>(
    subscribeSystemScheme,
    getSystemScheme,
    () => 'light',
  )
  if (defaultColorScheme === 'dark') {
    return 'dark'
  }
  if (defaultColorScheme === 'light') {
    return 'light'
  }
  return system
}

/**
 * Mantine + canvas host tokens (brand, Grok radii/typography, accent primary).
 * Not part of the `cursor/canvas` barrel.
 */
export function CanvasMantineRoot({
  children,
  defaultColorScheme = 'auto',
}: CanvasMantineRootProps) {
  const polarity = useResolvedPolarity(defaultColorScheme)
  const host = useMemo(
    () => resolveThemeForColorScheme(polarity),
    [polarity],
  )
  const mantineTheme = useMemo(() => createMantineThemeFromHost(host), [host])

  return (
    <MantineProvider
      theme={mantineTheme}
      defaultColorScheme={defaultColorScheme}
      forceColorScheme={polarity}
    >
      <div
        data-cursor-canvas-host
        style={{
          minHeight: 'inherit',
          background: host.bg.editor,
          color: host.text.primary,
          fontFamily: host.typography.fontFamily,
        }}
      >
        {/* Canvas-authored responsive SVGs (e.g. DAG): IDE scales to width; do not clamp max-height. */}
        <style>{`
          [data-cursor-canvas-host] svg[viewBox][width='100%'] {
            max-height: unset !important;
          }
        `}</style>
        {children}
      </div>
    </MantineProvider>
  )
}
