import { useComputedColorScheme } from '@mantine/core';
import { resolveThemeForColorScheme, type ShimHostTheme } from './host-tokens';

/**
 * Returns the host theme tokens for the active color scheme. Reads
 * `window.__cursorCanvas.state.theme` when present (IDE bridge); otherwise
 * Mantine color scheme + `prefers-color-scheme` defaults.
 */
export function useHostTheme(): ShimHostTheme {
  const scheme = useComputedColorScheme('light');
  const polarity = scheme === 'dark' ? 'dark' : 'light';
  return resolveThemeForColorScheme(polarity);
}
