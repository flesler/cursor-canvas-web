#!/usr/bin/env bash
# README assets from demo.canvas.tsx via sibling open-canvas (Playwright).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
bash "$REPO/scripts/render-demo-screenshots.sh" "$REPO/docs"
rm -f "$REPO/docs/demo-screenshot.png"
echo "→ docs/demo-light.png docs/demo-dark.png"
