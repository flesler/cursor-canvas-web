#!/usr/bin/env bash
set -euo pipefail
SRC="${CURSOR_SDK_DIR:-$HOME/.cursor/skills-cursor/canvas/sdk}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/test/contract/cursor-sdk"
if [[ ! -d "$SRC" ]]; then
  echo "sync-cursor-sdk: missing IDE SDK at $SRC" >&2
  exit 1
fi
rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$SRC"/. "$DEST"/
echo "Synced $(wc -l < "$DEST/index.d.ts") lines of index.d.ts from $SRC"
