/**
 * Design tokens + tone mappings for the shim (re-exports host token runtime).
 */

export {
  applyPrimaryColor,
  applyWorkbenchSurfaces,
  buildHostTokens,
  canvasFontFamilyCursor,
  canvasFontFamilyGrok,
  canvasPaletteDark,
  canvasPaletteGrokDark,
  canvasPaletteGrokLight,
  canvasPaletteLight,
  canvasRadius,
  canvasRadiusForBrand,
  canvasRadiusGrok,
  canvasSpacing,
  canvasTokens,
  canvasTokensLight,
  canvasTypography,
  canvasTypographyForBrand,
  canvasTypographyGrok,
  categoryPaletteDark,
  categoryPaletteGrokDark,
  categoryPaletteGrokLight,
  categoryPaletteLight,
  chartColorSequence,
  chartColorSequenceGrok,
  chartPalette,
  chartPaletteGrok,
  chartThemeForBrand,
  colorPalette,
  parseCanvasHostThemeBrand,
  parseHexColor,
  resolveTheme,
  resolveThemeForColorScheme,
  usageColorSequence,
} from './host-tokens'

export type {
  CanvasHostThemeBrand,
  CanvasHostThemeOverrides,
  CanvasPalette,
  CanvasTokens,
  CategoryPalette,
  ChartPalette,
  Color,
  ShimHostTheme,
} from './host-tokens'

/**
 * Maps every semantic tone literal used across primitives to a hex color, so
 * a `Stat tone="success"` and a `ChartSeries tone="success"` match.
 */
export const toneHex: Record<string, string> = {
  success: '#1F8A65',
  danger: '#CF2D56',
  warning: '#E8A33D',
  info: '#2E79B5',
  neutral: '#8888A8',
  added: '#1F8A65',
  deleted: '#CF2D56',
  renamed: '#5A6CC0',
}

/** Maps a semantic tone to a Mantine color name (for components that use it). */
export const toneColor: Record<string, string> = {
  success: 'green',
  danger: 'red',
  warning: 'orange',
  info: 'blue',
  neutral: 'gray',
  added: 'green',
  deleted: 'red',
  renamed: 'indigo',
}
