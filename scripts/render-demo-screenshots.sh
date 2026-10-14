#!/usr/bin/env bash
# Render demo.canvas.tsx light/dark PNGs via sibling open-canvas (Playwright).
# Usage: render-demo-screenshots.sh <output-dir>
set -euo pipefail

OUT_DIR="${1:?usage: render-demo-screenshots.sh <output-dir>}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPEN_CANVAS_ROOT="${OPEN_CANVAS_ROOT:-$REPO/../open-canvas}"
CLI="$OPEN_CANVAS_ROOT/dist/cli.js"
CANVAS="$REPO/.cursor/canvases/demo.canvas.tsx"
GEN_OUT="$(dirname "$CANVAS")/out"
TITLE='Open Canvas — SDK Showcase'

if [[ ! -f "$CLI" ]]; then
	echo "render-demo-screenshots: missing $CLI — run: (cd $OPEN_CANVAS_ROOT && npm run build:cli)" >&2
	exit 1
fi

pnpm --dir "$REPO" run build:lib
SHIM_PKG="$OPEN_CANVAS_ROOT/node_modules/@flesler/cursor-canvas-web"
SYNC_SHIM="$OPEN_CANVAS_ROOT/.cursor/skills/shim-rollout/scripts/sync-local-shim.sh"
if [[ -x "$SYNC_SHIM" ]] && [[ -d "$SHIM_PKG" ]]; then
	REAL_DIST="$(realpath "$REPO/dist" 2>/dev/null || echo "$REPO/dist")"
	REAL_PKG="$(realpath "$SHIM_PKG/dist" 2>/dev/null || echo "$SHIM_PKG/dist")"
	if [[ "$REAL_DIST" != "$REAL_PKG" ]]; then
		bash "$SYNC_SHIM"
	fi
fi

mkdir -p "$OUT_DIR"

shot() {
	local mode="$1"
	local dest="$2"
	node "$CLI" generate "$CANVAS" --title "$TITLE" --formats png --theme "$mode" --width 1280 --height 900
	cp "$GEN_OUT/demo.png" "$OUT_DIR/$dest"
}

shot light demo-light.png
shot dark demo-dark.png
