# AGENTS.md

Guidance for AI agents working in this repo.

## What this project is

A PoC that runs a **Cursor canvas** as a static web app. A canvas is a normal
React `.tsx` that imports **only** from `cursor/canvas`. At build time a Vite
alias + tsconfig path redirect `cursor/canvas` to a Mantine-backed shim, so the
unchanged canvas source renders on GitHub Pages.

The repo-owned canvas at `.cursor/canvases/demo.canvas.tsx` is the **single
source of truth**: the web app imports it directly, and the same file is copied
into the IDE-managed canvases folder so it renders in Cursor too.

## Golden rules

- **Never** import Mantine, Vite, or browser APIs inside `.cursor/canvases/**`.
  A canvas may import from `cursor/canvas` only. Keeping this pure is the whole
  point of the PoC.
- The shim **must stay API-compatible with the real SDK**. The authoritative
  contract is the vendored declarations at `src/vendor/canvas-sdk/*.d.ts`
  (synced from `~/.cursor/skills-cursor/canvas/sdk/`). Shim sources import
  prop types from that tree; npm `types` point at `src/superset/index.d.ts`
  (that tree plus superset features), not generated Mantine declarations. A canvas that compiles here
  must also compile/render unchanged in the IDE — match tone vocabularies
  (`StatTone`, `PillTone`, `CalloutTone`, `ChartTone`, `Text` tones). Do not
  invent exports (e.g. a generic `Tone`) that the real SDK lacks.
- **Superset** features beyond the SDK are the one exception: typed in
  `src/superset/`, exposed on SDK components only through an `extra` prop the
  IDE ignores. Recipe in [`COMPAT.md`](./COMPAT.md#superset).
- All adaptation lives under `src/shim/` behind the `cursor-canvas.tsx` barrel
  (split into `charts.tsx`, `diff.tsx`, `dag.ts`, `todo.tsx`, `theme.ts`,
  `use-tokens.ts`). Add new canvas API surface there, implemented with Mantine,
  mirroring the SDK declarations, and re-export it from the barrel.
- **SDK upkeep:** `npm run sync:sdk` copies the IDE declarations into
  `src/vendor/canvas-sdk/` and updates `manifest.json`. Release policy and
  intentional IDE vs web gaps: [`COMPAT.md`](./COMPAT.md). We do **not** keep
  parallel implementations per Cursor version.
- **Back-compat / defensive behavior** only at these boundaries (comment or dev
  log when behavior differs from the IDE):
  - `theme.ts` — `buildHostTheme()` extra tokens some canvases read on
    `useHostTheme()` though `hooks.d.ts` is narrower
  - `cursor-canvas.tsx` — `useCanvasState` (`localStorage`), `useCanvasAction`
    (no-op + dev log)
  - `charts.tsx` — Mantine/Recharts mapping; fork-only `reshapeLineChartData`
- Semantic colors go through `tone` → `src/shim/theme.ts` (`toneColor`), never
  hard-coded in components.
- Two settings must stay in sync when changing the alias: `resolve.alias` in
  `vite.config.ts` and `paths` in `tsconfig.json`.

## Canvases

Repo-owned canvases live at `.cursor/canvases/<name>.canvas.tsx` — versioned
source of truth, edit here. The IDE renders only from
`~/.cursor/projects/<workspace>/canvases/`, so after editing, `cp` the repo copy
over the managed one. Live UI edits persist to a managed-folder
`*.canvas.data.json` sidecar (not versioned); fold meaningful values into
open-canvas `showcase.canvas.data.json`, then `npm run sync:demo` (`--inline-state`
inlines state into `demo.canvas.tsx`). Skills reference their canvas by name and
keep it current.
Authoring rules: `canvas` skill.

## Environment

Node is pinned in `.nvmrc`. Run `nvm use` then `npm install`.

## Validation gate (run before finishing changes)

```bash
npm run typecheck          # tsc --noEmit, strict
npm run lint               # eslint flat config
npm test                 # vitest run
npm run test:contract    # export parity + consumer tsc + build:lib
npm run build              # full static build
```

After `npm run sync:sdk`: `npm run ci:local`, then `npm run test:render-compat` and `npm run test:demo-screenshots` (see `.cursor/skills/sdk-sync-compat/SKILL.md`). Use `npm run test:demo-screenshots:update` when baseline PNGs should move with the new SDK/shim.

npm releases: `.cursor/skills/release/SKILL.md`.

CI (`.github/workflows/ci.yml`) runs typecheck + lint + test on every push/PR.
`deploy.yml` publishes `dist/` to GitHub Pages on push to `main`.

## Conventions

- TypeScript strict; no `any`.
- ESLint matches `@flesler/open-canvas` (tabs, single quotes, trailing commas, no semicolons) plus react-hooks / react-refresh.
- Tests live in `src/shim/__tests__/`. Cover new shim helpers, hook behavior,
  and a smoke render of `.cursor/canvases/demo.canvas.tsx` (max SDK surface).
  When adding shim API, extend the demo + `canvas.smoke.test.tsx` assertions.
- After editing `.cursor/canvases/*.canvas.tsx`, copy it into the managed
  folder so the IDE picks up the change.
- Comments explain intent/trade-offs, not what the code obviously does.
