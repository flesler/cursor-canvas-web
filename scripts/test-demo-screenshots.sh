#!/usr/bin/env bash
# SDK / shim visual gate: render demo PNGs and compare to docs/ baseline.
# Pass --update to copy fresh renders onto docs/ (after reviewing a diff).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE="$REPO/docs"
UPDATE=0
for arg in "$@"; do
	case "$arg" in
	--update) UPDATE=1 ;;
	-h | --help)
		echo "usage: test-demo-screenshots.sh [--update]" >&2
		exit 0
		;;
	*)
		echo "unknown arg: $arg (try --update)" >&2
		exit 2
		;;
	esac
done

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "test-demo-screenshots: render current tree → $WORKDIR"
bash "$REPO/scripts/render-demo-screenshots.sh" "$WORKDIR"

if python3 "$REPO/scripts/compare-demo-screenshots.py" "$BASELINE" "$WORKDIR"; then
	echo "test-demo-screenshots: matches docs/"
	exit 0
fi

if [[ "$UPDATE" -eq 1 ]]; then
	echo "test-demo-screenshots: --update → docs/"
	cp -f "$WORKDIR/demo-light.png" "$BASELINE/demo-light.png"
	cp -f "$WORKDIR/demo-dark.png" "$BASELINE/demo-dark.png"
	python3 "$REPO/scripts/compare-demo-screenshots.py" "$BASELINE" "$WORKDIR"
	echo "test-demo-screenshots: docs/ updated"
	exit 0
fi

echo "test-demo-screenshots: differs from docs/ (layout/content/shim drift is expected after SDK work)" >&2
echo "test-demo-screenshots: re-run with --update to refresh docs/demo-*.png" >&2
exit 1
