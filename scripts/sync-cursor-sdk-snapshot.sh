#!/usr/bin/env bash
set -euo pipefail
SRC="${CURSOR_SDK_DIR:-$HOME/.cursor/skills-cursor/canvas/sdk}"
CANVAS_SKILL="${CURSOR_CANVAS_SKILL:-$(dirname "$SRC")/SKILL.md}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/src/vendor/canvas-sdk"
SKILL_REF="$ROOT/src/vendor/canvas/SKILL.md"
STUB="$ROOT/scripts/vendor-stubs/canvas-action-dispatch.d.ts"
if [[ ! -d "$SRC" ]]; then
  echo "sync-cursor-sdk: missing IDE SDK at $SRC" >&2
  exit 1
fi
rm -rf "$DEST"
mkdir -p "$DEST"
cp -a "$SRC"/. "$DEST"/
mkdir -p "$DEST/internal"
if [[ -f "$SRC/internal/canvas-action-dispatch.d.ts" ]]; then
  cp -a "$SRC/internal/." "$DEST/internal/"
else
  cp "$STUB" "$DEST/internal/canvas-action-dispatch.d.ts"
fi
find "$DEST" -type f \( -name '*.test.d.ts' -o -name '*.d.ts.map' \) -delete
while IFS= read -r -d '' f; do
  sed -i -e '/^[[:space:]]*\/\/#[[:space:]]*sourceMappingURL=/d' "$f"
done < <(find "$DEST" -type f -name '*.d.ts' -print0)
if [[ ! -f "$CANVAS_SKILL" ]]; then
  echo "sync-cursor-sdk: missing $CANVAS_SKILL" >&2
  exit 1
fi
mkdir -p "$(dirname "$SKILL_REF")"
cp "$CANVAS_SKILL" "$SKILL_REF"
npm run patch:vendor-paths --silent
echo "Synced from $SRC"
