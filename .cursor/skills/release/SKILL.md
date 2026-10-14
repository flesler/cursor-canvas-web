---
name: release
description: Read before cutting an npm release for this repo.
---

SDK sync gates: [sdk-sync-compat](../sdk-sync-compat/SKILL.md).

## Commit shape

NEVER squash the whole release into one commit titled `Release 1.1.0` (or similar) that mixes product changes with versioning.

1. Land normal commits on `main` (shim, vendor, demo, docs, scripts).
2. One final commit before the tag: only `package.json` version (and lockfile if you bump it), plus `CHANGELOG.md` for that version. Suggested subject: `chore: release v1.1.0` or `1.1.0`.

`CHANGELOG.md` uses `## [X.Y.Z] — YYYY-MM-DD` sections. Write the section in the version-only commit (or ensure it matches what already shipped in prior commits — do not duplicate narrative in the tag message).

## Ready to ship?

```bash
pnpm ci:local
pnpm build
```

If vendor changed since last tag: `pnpm run test:render-compat` and `pnpm run test:demo-screenshots` (open-canvas sibling). Refresh baselines with `pnpm run test:demo-screenshots:update` when intentional.

```bash
npm view @flesler/cursor-canvas-web version
node -p "require('./package.json').version"
```

Ship when `ci:local` is green, changelog matches the diff since the previous git tag, and working tree is committed except the deliberate version bump commit.

## Tag (no editor)

NEVER run bare `git tag` (opens an editor). Pass name and message on the CLI:

```bash
VERSION=1.1.0
git tag -a "v${VERSION}" -m "v${VERSION}"
git push origin "v${VERSION}"
```

Push the version bump commit to `main` before or with the tag.

Optional GitHub release (explicit OK only):

```bash
gh release create "v${VERSION}" --notes-file CHANGELOG.md --title "v${VERSION}"
```

Trim notes to that version’s section if the file lists multiple releases.

## Publish

```bash
npm publish --access public --tag latest
```

`prepublishOnly` runs `typecheck`, `test`, `check:sdk-exports`, and `build:lib`. Scoped package needs `--access public` and npm 2FA.

## Checklist

1. Feature commits on `main`
2. `pnpm ci:local` (+ SDK screenshot gates if vendor touched)
3. Version-only commit: `package.json`, `CHANGELOG.md` (± lockfile)
4. `git tag -a vX.Y.Z -m vX.Y.Z` → push branch + tag
5. `npm publish --access public --tag latest`
6. `npm view @flesler/cursor-canvas-web version`
