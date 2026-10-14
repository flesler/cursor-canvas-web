# Changelog

## [1.1.0] — 2026-10-14

- Vendored IDE `canvas-sdk` under `src/vendor/canvas-sdk/`; npm `types` and `./canvas-sdk` export use that tree.
- Strict export contract: shim barrel matches vendored `index.d.ts`; generated consumer in `src/contract/`.
- Host `brand` (Cursor / Grok): `host-tokens`, `CanvasMantineRoot`, chart sequence and component styling from `useHostTheme()`.
- SDK sync / render-compat skill; `test:render-compat` and `test:demo-screenshots` (open-canvas) for local vendor updates.
- Contract scripts in TypeScript (`tsx`); sync strips test maps and `sourceMappingURL` footers; `canvas-action-dispatch` stub when IDE bundle omits `internal/`.
- Dev: Vitest 4.1.11; pnpm audit overrides for transitive advisories.

## [1.0.2]

- IDE SDK snapshot + shim export contract tests.
