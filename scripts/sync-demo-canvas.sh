#!/usr/bin/env bash
# Fork demo = open-canvas showcase emitted with --formats cursor (data inlined).
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

node "$CLI" generate "$SHOWCASE" --formats cursor --out "$TMP"
EMIT="$TMP/showcase.canvas.tsx"
if [[ ! -f "$EMIT" ]]; then
	echo "expected cursor emit at $EMIT" >&2
	exit 1
fi

sed 's/showcase\.canvas\.tsx/demo.canvas.tsx/g' "$EMIT" > "$DEST"
echo "Wrote $DEST (from open-canvas --formats cursor)"
