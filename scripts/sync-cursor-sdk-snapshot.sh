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
LINES=$(wc -l < "$DEST/index.d.ts")
MANIFEST="$(dirname "$DEST")/sdk-manifest.json"
node -e "
const fs = require('fs');
const manifest = {
  syncedAt: new Date().toISOString().slice(0, 10),
  sdkSource: process.argv[1],
  indexLines: Number(process.argv[2]),
};
fs.writeFileSync(process.argv[3], JSON.stringify(manifest, null, 2) + '\n');
" "$SRC" "$LINES" "$MANIFEST"
echo "Synced $LINES lines of index.d.ts from $SRC"
echo "Wrote $MANIFEST"
