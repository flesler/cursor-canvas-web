---
name: release
description: Read before cutting an npm release for this repo.
---

SDK sync gates: [sdk-sync-compat](../sdk-sync-compat/SKILL.md).

## Agents

- **Never** `npm publish` — the user publishes to npm only.
- **Never** `git push`, tags, or `gh release` unless the user explicitly asks you to run a release.
- Do not chain multiple `git push` commands (branch then tag); use one push. Do not run `npm publish`.

## Commit shape

NEVER squash product work into the version commit. NEVER use one commit that mixes features with `package.json` / `CHANGELOG.md` for the release (including subjects like `Release 1.1.0: …` that bundle both).

1. Land normal commits on `main` (shim, vendor, demo, docs, scripts) — plain descriptive subjects (no `feat:` / `chore:` prefixes).
2. Last commit before the tag: only `package.json` version (and lockfile if you bump it), plus `CHANGELOG.md` for that version. Subject is **exactly the version number**, e.g. `1.1.0`.

`CHANGELOG.md` uses `## [X.Y.Z] — YYYY-MM-DD` sections. Write the section in the version-only commit (or ensure it matches what already shipped in prior commits — do not duplicate narrative in the tag message).

## Ready to ship?

```bash
npm run ci:local
npm run build
```

If vendor changed since last tag: `npm run test:render-compat` and `npm run test:demo-screenshots` (open-canvas sibling). Refresh baselines with `npm run test:demo-screenshots:update` when intentional.

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
git push origin main "v${VERSION}"
```

One push for branch + tag. User runs push when ready.

Optional GitHub release (user only, explicit OK):

```bash
gh release create "v${VERSION}" --notes-file CHANGELOG.md --title "v${VERSION}"
```

Trim notes to that version’s section if the file lists multiple releases.

## Publish (user only)

```bash
npm publish --access public --tag latest
```

`prepublishOnly` runs `typecheck`, `test`, `check:sdk-exports`, and `build:lib`. Scoped package needs `--access public` and npm 2FA.

## Checklist (user)

1. Product commits on `main`
2. `npm run ci:local` (+ SDK screenshot gates if vendor touched)
3. Version-only commit: `package.json`, `CHANGELOG.md` (± lockfile) — subject `X.Y.Z`
4. `git tag -a vX.Y.Z -m vX.Y.Z` → `git push origin main vX.Y.Z`
5. `npm publish --access public --tag latest`
6. `npm view @flesler/cursor-canvas-web version`
