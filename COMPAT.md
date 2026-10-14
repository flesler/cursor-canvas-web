# IDE SDK compatibility

## Policy

We implement **one** `cursor/canvas` surface: the IDE SDK snapshot in this repo. There is no runtime `v1 → v2` adapter chain.

| Change                         | What to do                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------- |
| New SDK export / optional prop | Implement in `src/shim/`, `pnpm run sync:sdk`, contract green → **patch** npm |
| Breaking SDK change            | Fix shim or **major** bump; document minimum Cursor / skill date here         |
| Old Cursor / old skill         | Not supported on `main`; use an older shim release from git/npm               |

**Defensive / back-compat** (extra fields, web-only behavior) lives only at documented boundaries — see `AGENTS.md` — with a short comment or dev log at the call site, not scattered version checks.

## Snapshot

- **Vendored contract:** `src/vendor/canvas-sdk/` (`.d.ts` tree + `manifest.json`).
- **IDE reference:** `~/.cursor/skills-cursor/canvas/sdk/` (copied by `pnpm run sync:sdk`).
- **Recorded target:** `src/vendor/canvas-sdk/manifest.json` (`syncedAt`, `sdkSource`, `indexLines`, `contentHash`).
- **Hash:** `contentHash` in manifest (SHA-256 over vendored `.d.ts` via `scripts/hash-canvas-sdk-tree.ts`). Cursor separately writes `canvases/node_modules/canvas-sdk-version` in the IDE; do not duplicate that file in our vendor tree or skill bundle.
- **Minimum SDK snapshot:** see manifest `syncedAt` for the npm release you ship; bump intentionally via sync + contract.

Published npm **types** resolve to `src/vendor/canvas-sdk/index.d.ts` (subpath `@flesler/cursor-canvas-web/canvas-sdk` for consumers copying the tree).

## Contract tests

| Script                    | What it checks                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm run sync:sdk`       | **Manual.** Copy IDE `sdk/*.d.ts` into `src/vendor/canvas-sdk/`, refresh `manifest.json`, restore `internal/canvas-action-dispatch.d.ts` stub if the skill bundle omits `internal/`. |
| `pnpm run test:contract`  | Strict export parity (`src/shim/cursor-canvas.tsx` vs vendored `index.d.ts`), consumer `tsc`, then `build:lib`.                                                                      |
| `pnpm run check:sdk-live` | Diff live Cursor SDK vs the shim barrel (does not write files).                                                                                                                      |
| `pnpm run test:render-compat` | **Local only** when vendor differs from HEAD: contract on synced tree, then smoke with HEAD vendor + current shim. Not CI. See `.cursor/skills/sdk-sync-compat/SKILL.md`. |

## Stack

- **Peers:** `@mantine/core` / `@mantine/charts` **^8.3** (upstream PoC targeted Mantine 7), `recharts` ^2.15 or ^3.

## Intentional shim differences

| Area                                                 | IDE SDK                                                                                | This shim                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `useCanvasState`                                     | `.canvas.data.json` sidecar                                                            | `localStorage`                                                          |
| `useCanvasAction`                                    | IDE dispatch                                                                           | no-op (dev log)                                                         |
| Charts                                               | Pure SVG                                                                               | Mantine + Recharts                                                      |
| `DiffView` syntax                                    | Shiki per-line tokens                                                                  | Plain text (`path`/`language` ignored for color; diff chrome unchanged) |
| Host theme SSE / workbench overrides                 | live host                                                                              | Mantine light/dark only                                                 |
| `useHostTheme().chart`                               | Not in public `hooks.d.ts` today; some canvases use `theme.chart.palette.*` at runtime | `{ palette: chartPalette, sequence: chartColorSequence }`               |
| `useHostTheme().radius` / `.typography` / `.spacing` | Declared in `theme.d.ts`, not on `CanvasHostTheme` in `hooks.d.ts`                     | Exposed for canvases that read layout tokens from the theme hook        |
| `Pill` `tone`                                        | Deprecated; IDE renders neutral only                                                   | Accepts `tone` for older canvases; ignored at render (neutral styling)  |
| `reshapeLineChartData`                               | Not in IDE `index.d.ts`                                                                | Internal helper in `charts.tsx` (not barrel-exported)                   |
| Host `brand: grok`                                   | Grok palettes, chart sequence, Sand radii/typography                                   | `resolveTheme` / `useHostTheme`; web defaults to `cursor` + Mantine scheme |

## open-canvas

Point dependency at this fork, alias `cursor/canvas` to the package (no `cursor-canvas-entry` wrapper). Copy vendored types from `@flesler/cursor-canvas-web/canvas-sdk` into the skill bundle as `assets/sdk/*.d.ts`. Run `open-canvas verify` and optional `CANVAS_CONTRACT_FIXTURES` via open-canvas `test:contract`.
