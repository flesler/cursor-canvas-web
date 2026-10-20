---
name: sdk-sync-compat
description: Read before syncing canvas-sdk or checking cross-snapshot render compat.
---

# Canvas SDK sync and render compatibility

## Manual sync only

`npm run sync:sdk` copies IDE `sdk/*.d.ts` into `src/vendor/canvas-sdk/` and strips `*.test.d.ts`, `*.d.ts.map`, and `//# sourceMappingURL=` footers. Nothing in CI, hooks, or `test:contract` runs sync or reads `~/.cursor`.

## Workflow (local, before commit)

1. `npm run sync:sdk` — vendor + `src/vendor/canvas/SKILL.md` are **uncommitted**.
2. Wire new `index.d.ts` exports in `src/shim/` if needed.
3. `npm run ci:local` — typecheck, lint, test, contract on the **new** vendor tree.
4. `npm run test:render-compat` — copies vendor aside, runs gates, swaps in a **temp** copy of HEAD’s SDK (via `git archive` only — no `checkout`/`stash`), `typecheck` + `npm run test`, then **always** restores the starting vendor tree on exit (success or failure).
5. `npm run test:demo-screenshots` — full-page PNGs via open-canvas (`1280` wide; height follows demo + shim). Compares to committed `docs/demo-*.png` (MD5). Restoring old PNGs without updating the shim will fail (e.g. height drift after `CanvasMantineRoot` / host tokens). After review: `npm run test:demo-screenshots:update`.
6. Commit vendor + shim (+ updated `docs/demo-*.png` when visuals changed) together.

If you already committed the sync: **once**, `git reset --soft HEAD^` to put the release back in the index/worktree, run steps 3–4, recommit. No `HEAD^` automation in scripts.

## What `test:render-compat` is not

- Not in CI (no uncommitted vendor there).
- No checked-in baseline fixture — old SDK is whatever `git` has at `HEAD` for `src/vendor/canvas-sdk/`.

## Optional

`npm run check:sdk-live` — diff live IDE `index.d.ts` vs shim; does not write files.
