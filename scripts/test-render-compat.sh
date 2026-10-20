#!/usr/bin/env bash
# Local-only when vendor differs from HEAD. Never mutates git (no checkout/stash).
# EXIT trap restores the on-disk vendor tree to the byte copy taken at start.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR_REL="src/vendor/canvas-sdk"
VENDOR="$ROOT/$VENDOR_REL"
LEGACY_SDK="src/contract/cursor-sdk"
STUB="$ROOT/scripts/vendor-stubs/canvas-action-dispatch.d.ts"
cd "$ROOT"

if git diff --quiet HEAD -- "$VENDOR_REL" && git diff --cached --quiet HEAD -- "$VENDOR_REL"; then
  echo "test-render-compat: no vendor diff vs HEAD." >&2
  echo "  Normal: npm run sync:sdk leaves uncommitted vendor — run gates, then this script." >&2
  echo "  One-off (sync already committed): git reset --soft HEAD^ then re-run." >&2
  exit 1
fi

WORKDIR="$(mktemp -d)"
START_VENDOR="$WORKDIR/start-vendor"
HEAD_VENDOR="$WORKDIR/head-vendor"
EXTRACT="$WORKDIR/extract"

restore_start_vendor() {
  rm -rf "$VENDOR"
  mkdir -p "$(dirname "$VENDOR")"
  cp -a "$START_VENDOR/." "$VENDOR/"
}

cleanup() {
  local ec=$?
  restore_start_vendor 2>/dev/null || true
  rm -rf "$WORKDIR"
  exit "$ec"
}
trap cleanup EXIT

cp -a "$VENDOR/." "$START_VENDOR/"

materialize_head_sdk_into() {
  local dest="$1"
  rm -rf "$dest"
  mkdir -p "$dest"
  rm -rf "$EXTRACT"
  mkdir -p "$EXTRACT"

  if git rev-parse --verify "HEAD:$VENDOR_REL/index.d.ts" >/dev/null 2>&1; then
    git archive HEAD "$VENDOR_REL" | tar -x -C "$EXTRACT"
    cp -a "$EXTRACT/$VENDOR_REL/." "$dest/"
  elif git rev-parse --verify "HEAD:$LEGACY_SDK/index.d.ts" >/dev/null 2>&1; then
    git archive HEAD "$LEGACY_SDK" | tar -x -C "$EXTRACT"
    cp -a "$EXTRACT/$LEGACY_SDK/." "$dest/"
    mkdir -p "$dest/internal"
    cp "$STUB" "$dest/internal/canvas-action-dispatch.d.ts"
    find "$dest" -type f \( -name '*.test.d.ts' -o -name '*.d.ts.map' \) -delete
  fi
}

install_vendor_from() {
  local src="$1"
  rm -rf "$VENDOR"
  mkdir -p "$(dirname "$VENDOR")"
  cp -a "$src/." "$VENDOR/"
}

materialize_head_sdk_into "$HEAD_VENDOR"

echo "test-render-compat: gates with synced vendor (working tree)"
npm run typecheck
npm test
npm run check:sdk-exports
tsx scripts/generate-contract-consumer.ts
tsc --noEmit

echo "test-render-compat: typecheck + smoke with HEAD SDK snapshot + current shim"
install_vendor_from "$HEAD_VENDOR"
npm run typecheck
npm test

echo "test-render-compat: ok"
