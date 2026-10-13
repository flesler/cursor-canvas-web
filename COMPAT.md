# IDE SDK compatibility

## Policy

We implement **one** `cursor/canvas` surface: the IDE SDK snapshot in this repo. There is no runtime `v1 → v2` adapter chain.

|Change|What to do|
|---|---|
|New SDK export / optional prop|Implement in `src/shim/`, `pnpm run sync:sdk`, contract green → **patch** npm|
|Breaking SDK change|Fix shim or **major** bump; document minimum Cursor / skill date here|
|Old Cursor / old skill|Not supported on `main`; use an older shim release from git/npm|

**Defensive / back-compat** (extra fields, web-only behavior) lives only at documented boundaries — see `AGENTS.md` — with a short comment or dev log at the call site, not scattered version checks.

## Snapshot

- **IDE reference:** `~/.cursor/skills-cursor/canvas/sdk/` (synced into `test/contract/cursor-sdk/` via `pnpm run sync:sdk`).
- **Recorded target:** `test/contract/sdk-manifest.json` (date + source path; updated on every sync).
- **Last synced:** manifest `syncedAt` or git history on `test/contract/cursor-sdk/`.

## Contract tests

|Script|What it checks|
|---|---|
|`pnpm run sync:sdk`|**Manual.** Copy this machine’s IDE `sdk/*.d.ts` into `test/contract/cursor-sdk/`. Commit the snapshot when you intentionally bump the contract target.|
|`pnpm run test:contract`|Builds the lib and **warns** on missing SDK names. Does not fail the push.|
|`pnpm run test:contract:strict`|Optional. `tsc` against every name in the committed snapshot.|
|`pnpm run check:sdk-live`|Diff this machine’s Cursor SDK vs the built shim. Does not write files. Shim should be a **superset** of both the committed snapshot and the live skill.|

## Stack

- **Peers:** `@mantine/core` / `@mantine/charts` **^8.3** (upstream PoC targeted Mantine 7), `recharts` ^2.15 or ^3.

## Intentional shim differences

|Area|IDE SDK|This shim|
|---|---|---|
|`useCanvasState`|`.canvas.data.json` sidecar|`localStorage`|
|`useCanvasAction`|IDE dispatch|no-op (dev log)|
|Charts|Pure SVG|Mantine + Recharts|
|Host theme SSE / workbench overrides|live host|Mantine light/dark only|
|`useHostTheme().chart`|Not in public `hooks.d.ts` today; some canvases use `theme.chart.palette.*` at runtime|`{ palette: chartPalette, sequence: chartColorSequence }`|
|`useHostTheme().radius` / `.typography` / `.spacing`|Declared in `theme.d.ts`, not on `CanvasHostTheme` in `hooks.d.ts`|Exposed for canvases that read layout tokens from the theme hook|
|`reshapeLineChartData`|Not in IDE `index.d.ts`|Exported helper for Mantine data shaping|

## open-canvas

Point dependency at this fork, alias `cursor/canvas` to the package (no `cursor-canvas-entry` wrapper). Run `open-canvas verify` and optional `CANVAS_CONTRACT_FIXTURES` via open-canvas `test:contract`.
