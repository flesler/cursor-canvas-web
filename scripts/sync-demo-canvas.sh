#!/usr/bin/env bash
# Demo = open-canvas showcase (--formats cursor --inline-state: data + sidecar in one file).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPEN_CANVAS_ROOT="${OPEN_CANVAS_ROOT:-$REPO/../open-canvas}"
CLI="$OPEN_CANVAS_ROOT/dist/cli.js"
SHOWCASE="$OPEN_CANVAS_ROOT/example/showcase.canvas.tsx"
DEST="$REPO/.cursor/canvases/demo.canvas.tsx"
TMP="$(mktemp -d)"

if [[ ! -f "$CLI" ]]; then
	echo "missing $CLI — run: (cd $OPEN_CANVAS_ROOT && npm run build:cli)" >&2
	exit 1
fi

node "$CLI" generate "$SHOWCASE" --formats cursor --inline-state --out "$TMP"
EMIT="$TMP/showcase.canvas.tsx"
if [[ ! -f "$EMIT" ]]; then
	echo "expected cursor emit at $EMIT" >&2
	exit 1
fi

sed 's/showcase\.canvas\.tsx/demo.canvas.tsx/g' "$EMIT" > "$DEST"
rm -f "$REPO/.cursor/canvases/demo.canvas.data.json"
rm -rf "$TMP"
echo "Wrote $DEST (open-canvas --formats cursor --inline-state)"
