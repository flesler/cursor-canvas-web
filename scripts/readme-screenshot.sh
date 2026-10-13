#!/usr/bin/env bash
# README assets from demo.canvas.tsx via sibling open-canvas (Playwright).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPEN_CANVAS_ROOT="${OPEN_CANVAS_ROOT:-$REPO/../open-canvas}"
CLI="$OPEN_CANVAS_ROOT/dist/cli.js"
CANVAS="$REPO/.cursor/canvases/demo.canvas.tsx"
OUT_DIR="$(dirname "$CANVAS")/out"
TITLE='Open Canvas — SDK Showcase'

if [[ ! -f "$CLI" ]]; then
	echo "missing $CLI — run: (cd $OPEN_CANVAS_ROOT && npm run build:cli)" >&2
	exit 1
fi

mkdir -p "$REPO/docs"
node "$CLI" generate "$CANVAS" --title "$TITLE" --formats png --theme light --width 1280 --height 900
cp "$OUT_DIR/demo.png" "$REPO/docs/demo-light.png"
node "$CLI" generate "$CANVAS" --title "$TITLE" --formats png --theme dark --width 1280 --height 900
cp "$OUT_DIR/demo.png" "$REPO/docs/demo-dark.png"
rm -f "$REPO/docs/demo-screenshot.png"
echo "→ docs/demo-light.png docs/demo-dark.png"
