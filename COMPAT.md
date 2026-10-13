# IDE SDK compatibility

## Policy

We implement **one** `cursor/canvas` surface: the IDE SDK snapshot in this repo. There is no runtime `v1 → v2` adapter chain.

| Change | What to do |
|--------|------------|
| New SDK export / optional prop | Implement in `src/shim/`, `pnpm run sync:sdk`, contract green → **patch** npm |
| Breaking SDK change | Fix shim or **major** bump; document minimum Cursor / skill date here |
| Old Cursor / old skill | Not supported on `main`; use an older shim release from git/npm |

**Defensive / back-compat** (extra fields, web-only behavior) lives only at documented boundaries — see `AGENTS.md` — with a short comment or dev log at the call site, not scattered version checks.

## Snapshot

- **IDE reference:** `~/.cursor/skills-cursor/canvas/sdk/` (synced into `test/contract/cursor-sdk/` via `pnpm run sync:sdk`).
- **Recorded target:** `test/contract/sdk-manifest.json` (date + source path; updated on every sync).
- **Last synced:** manifest `syncedAt` or git history on `test/contract/cursor-sdk/`.

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
