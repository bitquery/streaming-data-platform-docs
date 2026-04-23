#!/usr/bin/env python3
"""Blur the real user email in the Bitquery MCP sign-in / authorize screenshots."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "static" / "img" / "mcp"


def blur_region(path: Path, box: tuple[int, int, int, int], radius: int = 14) -> None:
    im = Image.open(path).convert("RGBA")
    region = im.crop(box).filter(ImageFilter.GaussianBlur(radius=radius))
    im.paste(region, box)
    im.save(path)
    print(f"blurred {path.name} at {box}")


# 1) Sign-in screen — email input field contains "astudnev@gmail.com"
#    Image is 1552x1344. The email text sits near the top-left of the Email
#    input box. We blur a safe rectangle around the visible email text.
blur_region(
    IMG_DIR / "mcp-bitquery-sign-in.png",
    box=(205, 605, 560, 680),
    radius=16,
)

# 2) Authorize-access screen — "Signed in as astudnev@gmail.com." footer
#    Image is 2102x670. Widen the box to cover the full centered line so the
#    blur does not cut mid-word, leaving any part of the email readable.
blur_region(
    IMG_DIR / "mcp-bitquery-authorize-access.png",
    box=(700, 520, 1450, 600),
    radius=16,
)
