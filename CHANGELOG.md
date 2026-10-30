# Changelog

## [1.3.0] — 2026-10-30

- Host tokens: category `gray` follows the active canvas palette `foregroundTertiary` (SDK rule); category tables rebuild after workbench foreground overrides so `useHostTheme().category.gray` stays aligned with `text.tertiary`.
- Tests for category hues, Swatch light/dark gray, and UsageBar segment colors; refreshed `docs/demo-*.png` baselines.
- Test harness: jsdom `ResizeObserver` layout mock, chart prop fixes (no invalid DOM attrs), nested `Text` coercion; quiet `prepublishOnly` / smoke stderr.

## [1.2.1] — 2026-10-28

- Vendor docs: rewrite `~/.cursor/skills-cursor/...` paths to `../canvas-sdk` / `../canvas/SKILL.md` for `open-canvas vendor-path` agents (`npm run patch:vendor-paths`; runs at end of `sync:sdk`).

## [1.2.0] — 2026-10-20

- **Superset typings:** ship `src/superset/` on npm (`types` and `cursor/canvas` path for open-canvas); bar/line chart `extra` props and value-axis helpers.
- **Toolchain:** npm (drop pnpm), Node `24.11.1` via `.nvmrc`, ESLint 10 + stylistic/import rules aligned with open-canvas; single-job CI on `setup-node`.
- **Demo & docs:** expanded demo canvas with inlined state; README positions the repo as a standalone project (credit to upstream).
- **Charts & host tokens:** continued IDE parity (reference lines, value axis, donut center labels, host theme wiring).

## [1.1.2] — 2026-10-14

- Donut charts: center total + “Total” label via host typography and text colors (not Mantine `chartLabel` only).

## [1.1.1] — 2026-10-14

- Charts: horizontal bar category ticks, pie/donut legend highlight, line `smooth`, reference lines, and value-axis defaults closer to IDE.
- Shim components and `CanvasMantineRoot` use host theme tokens more consistently.
- Pre-push hook skips rewriting unchanged contract consumer; release skill documents agent boundaries.

## [1.1.0] — 2026-10-14

- Vendored IDE `canvas-sdk` under `src/vendor/canvas-sdk/`; npm `types` and `./canvas-sdk` export use that tree.
- Strict export contract: shim barrel matches vendored `index.d.ts`; generated consumer in `src/contract/`.
- Host `brand` (Cursor / Grok): `host-tokens`, `CanvasMantineRoot`, chart sequence and component styling from `useHostTheme()`.
- SDK sync / render-compat skill; `test:render-compat` and `test:demo-screenshots` (open-canvas) for local vendor updates.
- Contract scripts in TypeScript (`tsx`); sync strips test maps and `sourceMappingURL` footers; `canvas-action-dispatch` stub when IDE bundle omits `internal/`.
- Dev: Vitest 4.1.11; pnpm audit overrides for transitive advisories.

## [1.0.2]

- IDE SDK snapshot + shim export contract tests.
