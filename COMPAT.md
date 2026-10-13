# IDE SDK compatibility

## Snapshot

- **IDE reference:** `~/.cursor/skills-cursor/canvas/sdk/` (synced into `test/contract/cursor-sdk/` via `pnpm run sync:sdk`).
- **Last synced:** run `pnpm run sync:sdk` and check git history for the date.

## Contract tests

| Script | What it checks |
|--------|----------------|
| `pnpm run sync:sdk` | Copy IDE `sdk/*.d.ts` into `test/contract/cursor-sdk/` |
| `pnpm run test:contract` | `tsc --noEmit` on generated consumer importing every SDK `index.d.ts` export via **this package’s** types |
| `pnpm run check:sdk-exports` | Name diff: IDE `index.d.ts` vs `dist/shim/cursor-canvas.d.ts` |

## Stack

- **Peers:** `@mantine/core` / `@mantine/charts` **^8.3** (upstream PoC targeted Mantine 7), `recharts` ^2.15 or ^3.

## Intentional shim differences

| Area | IDE SDK | This shim |
|------|---------|-----------|
| `useCanvasState` | `.canvas.data.json` sidecar | `localStorage` |
| `useCanvasAction` | IDE dispatch | no-op (dev log) |
| Charts | Pure SVG | Mantine + Recharts |
| Host theme SSE / workbench overrides | live host | Mantine light/dark only |
| **`useHostTheme().chart`** | Not in public `hooks.d.ts` today; some canvases use `theme.chart.palette.*` at runtime | `{ palette: chartPalette, sequence: chartColorSequence }` |
| **`useHostTheme().radius` / `.typography` / `.spacing`** | Declared in `theme.d.ts`, not on `CanvasHostTheme` in `hooks.d.ts` | Exposed for canvases that read layout tokens from the theme hook |
| **`reshapeLineChartData`** | Not in IDE `index.d.ts` | Exported helper for Mantine data shaping |

## open-canvas

Point dependency at this fork, alias `cursor/canvas` to the package (no `cursor-canvas-entry` wrapper). Run `open-canvas verify` and optional `CANVAS_CONTRACT_FIXTURES` via open-canvas `test:contract`.
