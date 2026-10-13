/**
 * Design tokens + tone mappings for the shim.
 *
 * Mirrors the real `cursor/canvas` token surface (`canvasPaletteDark/Light`,
 * `canvasTokens`, `colorPalette`, `usageColorSequence`, `Color`) so canvases
 * that read tokens via `useHostTheme()` or import the palettes work unchanged.
 * Values are aligned with the Cursor dark/light themes from the SDK.
 */

export const canvasPaletteDark = {
  foreground: '#E4E4E4EB',
  foregroundSecondary: '#E4E4E48D',
  foregroundTertiary: '#E4E4E45E',
  foregroundQuaternary: '#E4E4E442',
  editor: '#181818',
  chrome: '#141414',
  sidebar: '#141414',
  elevated: '#181818',
  fillPrimary: '#E4E4E430',
  fillSecondary: '#E4E4E41E',
  fillTertiary: '#E4E4E411',
  fillQuaternary: '#E4E4E40A',
  strokePrimary: '#E4E4E433',
  strokeSecondary: '#E4E4E41F',
  strokeTertiary: '#E4E4E414',
  strokeFocused: '#599CE7',
  accent: '#599CE7',
  buttonBackground: '#599CE7',
  buttonForeground: '#191c22',
  buttonHoverBackground: '#6AABE9',
  link: '#87c3ff',
  diffInsertedLine: '#3FA26633',
  diffRemovedLine: '#B8004933',
  diffStripAdded: '#3FA2668F',
  diffStripRemoved: '#FC6B838F',
} as const;

export const canvasPaletteLight = {
  foreground: '#141414F0',
  foregroundSecondary: '#141414BD',
  foregroundTertiary: '#1414148A',
  foregroundQuaternary: '#1414145C',
  editor: '#FCFCFC',
  chrome: '#F8F8F8',
  sidebar: '#F3F3F3',
  elevated: '#FCFCFC',
  fillPrimary: '#14141433',
  fillSecondary: '#14141424',
  fillTertiary: '#14141414',
  fillQuaternary: '#1414140F',
  strokePrimary: '#14141433',
  strokeSecondary: '#1414141F',
  strokeTertiary: '#14141414',
  strokeFocused: '#3685BF',
  accent: '#3685BF',
  buttonBackground: '#3685BF',
  buttonForeground: '#FCFCFC',
  buttonHoverBackground: '#2E76AB',
  link: '#3685BF',
  diffInsertedLine: '#1F8A651F',
  diffRemovedLine: '#CF2D5614',
  diffStripAdded: '#1F8A65CC',
  diffStripRemoved: '#CF2D56CC',
} as const;

export interface CanvasPalette {
  readonly foreground: string;
  readonly foregroundSecondary: string;
  readonly foregroundTertiary: string;
  readonly foregroundQuaternary: string;
  readonly editor: string;
  readonly chrome: string;
  readonly sidebar: string;
  readonly elevated: string;
  readonly fillPrimary: string;
  readonly fillSecondary: string;
  readonly fillTertiary: string;
  readonly fillQuaternary: string;
  readonly strokePrimary: string;
  readonly strokeSecondary: string;
  readonly strokeTertiary: string;
  readonly strokeFocused: string;
  readonly accent: string;
  readonly buttonBackground: string;
  readonly buttonForeground: string;
  readonly buttonHoverBackground: string;
  readonly link: string;
  readonly diffInsertedLine: string;
  readonly diffRemovedLine: string;
  readonly diffStripAdded: string;
  readonly diffStripRemoved: string;
}

export type Color =
  | 'gray'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'cyan'
  | 'pink'
  | 'blue'
  | 'orange'
  | 'red';

export type CategoryPalette = Readonly<Record<Color, string>>;

export const categoryPaletteDark: CategoryPalette = {
  gray: '#8888A8E0',
  purple: '#7B64B8F0',
  green: '#1F8A65E8',
  yellow: '#E8C030E0',
  cyan: '#2A9A8AE0',
  pink: '#C85898E0',
  blue: '#2E79B5E0',
  orange: '#F0A040E0',
  red: '#C04848E0',
};

export const categoryPaletteLight: CategoryPalette = {
  gray: '#8888A8E0',
  purple: '#7B64B8F0',
  green: '#1F8A65E8',
  yellow: '#E8C030E0',
  cyan: '#2A9A8AE0',
  pink: '#C85898E0',
  blue: '#2E79B5E0',
  orange: '#F0A088E0',
  red: '#CF2D56E0',
};

function buildTokens(palette: CanvasPalette, category: CategoryPalette) {
  return {
    bg: {
      editor: palette.editor,
      chrome: palette.chrome,
      elevated: palette.elevated,
    },
    text: {
      primary: palette.foreground,
      secondary: palette.foregroundSecondary,
      tertiary: palette.foregroundTertiary,
      quaternary: palette.foregroundQuaternary,
      link: palette.link,
      onAccent: palette.buttonForeground,
    },
    stroke: {
      primary: palette.strokePrimary,
      secondary: palette.strokeSecondary,
      tertiary: palette.strokeTertiary,
      focused: palette.strokeFocused,
    },
    fill: {
      primary: palette.fillPrimary,
      secondary: palette.fillSecondary,
      tertiary: palette.fillTertiary,
      quaternary: palette.fillQuaternary,
    },
    accent: {
      primary: palette.accent,
      control: palette.buttonBackground,
      controlHover: palette.buttonHoverBackground,
    },
    diff: {
      insertedLine: palette.diffInsertedLine,
      removedLine: palette.diffRemovedLine,
      stripAdded: palette.diffStripAdded,
      stripRemoved: palette.diffStripRemoved,
    },
    category,
  };
}

export type CanvasTokens = ReturnType<typeof buildTokens>;

export const canvasTokens = buildTokens(
  canvasPaletteDark,
  categoryPaletteDark,
);
export const canvasTokensLight = buildTokens(
  canvasPaletteLight,
  categoryPaletteLight,
);

/** Legacy name; prefer `useHostTheme().category`. */
export const colorPalette = categoryPaletteDark;

/** Auto-color rotation for `UsageBar` segments without an explicit color. */
export const usageColorSequence: readonly Color[] = [
  'blue',
  'purple',
  'green',
  'yellow',
  'cyan',
  'pink',
  'orange',
  'red',
  'gray',
];

/** Chart palette keys (IDE `canvas-tokens.d.ts` — not re-exported from SDK `index.d.ts`). */
export const chartPalette = {
  green: '#1F8A65E8',
  darkGreen: '#0D855AE0',
  lightGreen: '#52B896E0',
  mintGreen: '#7DCAB0E0',
  blue: '#2E79B5E0',
  lightBlue: '#70B0D8E0',
  indigo: '#5A6CC0F0',
  lightIndigo: '#9AAADCE0',
  purple: '#7B64B8F0',
  lightPurple: '#AA98D8E0',
  warmPink: '#C85898E0',
  lightPink: '#E8A0C4E0',
  brightOrange: '#F0A040E0',
  deepOrange: '#C06028E0',
  goldenYellow: '#E8C030E0',
  darkAmber: '#C04848E0',
  warmPeach: '#F0A088E0',
  vibrantTeal: '#2A9A8AE0',
  muted: '#8888A8E0',
  neutralLine: '#888899D0',
} as const;

export type ChartPalette = typeof chartPalette;

/** Typography / spacing / radius from IDE `theme.d.ts` (available on `useHostTheme()`). */
export const canvasTypography = {
  h1: { fontSize: '24px', lineHeight: '30px', fontWeight: 590 },
  h2: { fontSize: '18px', lineHeight: '24px', fontWeight: 590 },
  h3: { fontSize: '16px', lineHeight: '22px', fontWeight: 590 },
  body: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
  small: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
} as const;

export const canvasSpacing = {
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '3.5': 14,
  '4': 16,
  '4.5': 18,
  '5': 20,
  '6': 24,
  '7': 28,
  '8': 32,
  '9': 36,
  '10': 40,
} as const;

export const canvasRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/** Ordered hues for automatic chart-series coloring. */
export const chartColorSequence: readonly string[] = [
  '#1F8A65E8',
  '#70B0D8E0',
  '#5A6CC0F0',
  '#F0A040E0',
  '#C06028E0',
  '#E8C030E0',
  '#C85898E0',
  '#F0A088E0',
  '#7B64B8F0',
  '#7DCAB0E0',
  '#8888A8E0',
  '#2A9A8AE0',
];

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
};

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
};

/** Host theme returned by `useHostTheme()`. Extends the token groups. */
export interface CanvasHostTheme extends CanvasTokens {
  readonly kind: string;
  readonly tokens: CanvasTokens;
  readonly palette: CanvasPalette;
  readonly category: CategoryPalette;
  /** Used by some IDE canvases for custom SVG; see COMPAT.md. */
  readonly chart: {
    readonly palette: ChartPalette;
    readonly sequence: readonly string[];
  };
  readonly radius: typeof canvasRadius;
  readonly typography: typeof canvasTypography;
  readonly spacing: typeof canvasSpacing;
}

export function buildHostTheme(kind: 'light' | 'dark'): CanvasHostTheme {
  const tokens = kind === 'dark' ? canvasTokens : canvasTokensLight;
  const palette = kind === 'dark' ? canvasPaletteDark : canvasPaletteLight;
  const category =
    kind === 'dark' ? categoryPaletteDark : categoryPaletteLight;
  return {
    ...tokens,
    kind,
    tokens,
    palette,
    category,
    chart: { palette: chartPalette, sequence: chartColorSequence },
    radius: canvasRadius,
    typography: canvasTypography,
    spacing: canvasSpacing,
  };
}
