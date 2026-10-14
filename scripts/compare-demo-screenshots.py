#!/usr/bin/env python3
"""Compare README demo PNG pairs (baseline vs candidate).

Requires Pillow. Exit 0 if all pairs match (MD5), else 1 and print diffs.

Usage:
  python3 scripts/compare-demo-screenshots.py <baseline-dir> <candidate-dir>
"""

from __future__ import annotations

import hashlib
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print(
        "compare-demo-screenshots: install Pillow (pip install Pillow)",
        file=sys.stderr,
    )
    sys.exit(2)

PAIRS = ("demo-light.png", "demo-dark.png")


def file_md5(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def describe_visual_diff(base_path: Path, cand_path: Path) -> str:
    ia = Image.open(base_path).convert("RGB")
    ib = Image.open(cand_path).convert("RGB")
    base_md5 = file_md5(base_path)[:8]
    cand_md5 = file_md5(cand_path)[:8]
    if ia.size != ib.size:
        bw, bh = ia.size
        cw, ch = ib.size
        return (
            f"differs (size {bw}×{bh} vs {cw}×{ch}, "
            f"Δh={ch - bh:+d}px; md5 {base_md5}… vs {cand_md5}…)"
        )
    w, h = ia.size
    total = w * h
    diff = sum(
        1
        for pa, pb in zip(ia.get_flattened_data(), ib.get_flattened_data())
        if pa != pb
    )
    frac = diff / total
    return (
        f"differs ({frac * 100:.2f}% pixels, md5 {base_md5}… vs {cand_md5}…)"
    )


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(
            "usage: compare-demo-screenshots.py <baseline-dir> <candidate-dir>",
        )
    baseline = Path(sys.argv[1]).resolve()
    candidate = Path(sys.argv[2]).resolve()
    any_diff = False

    for name in PAIRS:
        base_path = baseline / name
        cand_path = candidate / name
        if not base_path.is_file():
            raise SystemExit(f"missing baseline {base_path}")
        if not cand_path.is_file():
            raise SystemExit(f"missing candidate {cand_path}")

        base_md5 = file_md5(base_path)
        cand_md5 = file_md5(cand_path)
        if base_md5 == cand_md5:
            print(f"{name}: identical")
            continue

        any_diff = True
        print(f"{name}: {describe_visual_diff(base_path, cand_path)}")

    if any_diff:
        raise SystemExit(1)
    print("compare-demo-screenshots: ok")


if __name__ == "__main__":
    main()
