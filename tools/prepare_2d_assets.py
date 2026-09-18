"""Prepare the supplied 2D reference art for deterministic Remotion animation.

The character silhouettes are isolated without generative repainting, then all
three references are color-traced to SVG so their identity and palette remain
those of the supplied artwork.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
import vtracer


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(
    r"C:\Users\caspi\.cursor\projects\c-Users-caspi-video-generator\assets"
)
OUT = ROOT / "explainer" / "public" / "art"

SOURCES = {
    "bravo": SOURCE_DIR
    / "c__Users_caspi_AppData_Roaming_Cursor_User_workspaceStorage_2814b9de9f0ff39e4390093e0633b6fc_images_bravo-cbcf58c5-edee-459f-99ba-09115d9de3eb.png",
    "pipi": SOURCE_DIR
    / "c__Users_caspi_AppData_Roaming_Cursor_User_workspaceStorage_2814b9de9f0ff39e4390093e0633b6fc_images_pip_vector-89e21f3c-87c2-4aca-9fcf-59270588bed1.jpg",
    "lab": SOURCE_DIR
    / "c__Users_caspi_AppData_Roaming_Cursor_User_workspaceStorage_2814b9de9f0ff39e4390093e0633b6fc_images_lab_vector-35dd54bf-5527-42d7-a528-b2d15523aa4d.jpg",
}


def border_background_alpha(image: Image.Image, tolerance: float) -> Image.Image:
    """Remove only border-connected pixels near the sampled background color."""
    rgb = np.asarray(image.convert("RGB"), dtype=np.int16)
    h, w, _ = rgb.shape
    corners = np.array(
        [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]],
        dtype=np.float32,
    )
    background = np.median(corners, axis=0)
    distance = np.sqrt(np.sum((rgb - background) ** 2, axis=2))
    candidate = distance <= tolerance

    visited = np.zeros((h, w), dtype=np.bool_)
    queue: deque[tuple[int, int]] = deque()
    for x in range(w):
        if candidate[0, x]:
            queue.append((0, x))
        if candidate[h - 1, x]:
            queue.append((h - 1, x))
    for y in range(h):
        if candidate[y, 0]:
            queue.append((y, 0))
        if candidate[y, w - 1]:
            queue.append((y, w - 1))

    while queue:
        y, x = queue.popleft()
        if visited[y, x] or not candidate[y, x]:
            continue
        visited[y, x] = True
        if y:
            queue.append((y - 1, x))
        if y + 1 < h:
            queue.append((y + 1, x))
        if x:
            queue.append((y, x - 1))
        if x + 1 < w:
            queue.append((y, x + 1))

    # Soft two-pixel fringe preserves antialiasing without a white/grey halo.
    alpha = np.where(visited, 0, 255).astype(np.uint8)
    rgba = np.dstack([rgb.astype(np.uint8), alpha])
    return Image.fromarray(rgba, "RGBA")


def clear_bravo_leg_gap(image: Image.Image) -> Image.Image:
    """Clear the enclosed white pocket between the legs in the T-pose sheet."""
    rgba = np.asarray(image).copy()
    h, w, _ = rgba.shape
    rgb = rgba[:, :, :3].astype(np.int16)
    white_distance = np.sqrt(np.sum((rgb - 255) ** 2, axis=2))
    y0, y1 = int(h * 0.58), int(h * 0.98)
    x0, x1 = int(w * 0.45), int(w * 0.55)
    pocket = np.zeros((h, w), dtype=np.bool_)
    pocket[y0:y1, x0:x1] = True
    rgba[:, :, 3][pocket & (white_distance < 34)] = 0
    return Image.fromarray(rgba, "RGBA")


def trace(source: Path, target: Path) -> None:
    vtracer.convert_image_to_svg_py(
        str(source),
        str(target),
        colormode="color",
        hierarchical="stacked",
        mode="spline",
        filter_speckle=5,
        color_precision=7,
        layer_difference=10,
        corner_threshold=60,
        length_threshold=4.0,
        max_iterations=10,
        splice_threshold=45,
        path_precision=6,
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    bravo = clear_bravo_leg_gap(
        border_background_alpha(Image.open(SOURCES["bravo"]), tolerance=25)
    )
    bravo_png = OUT / "bravo-cutout.png"
    bravo.save(bravo_png)

    pipi = border_background_alpha(Image.open(SOURCES["pipi"]), tolerance=35)
    pipi_png = OUT / "pipi-cutout.png"
    pipi.save(pipi_png)

    lab_png = OUT / "lab.png"
    Image.open(SOURCES["lab"]).convert("RGB").save(lab_png, quality=96)

    for source, name in (
        (bravo_png, "bravo.svg"),
        (pipi_png, "pipi.svg"),
        (lab_png, "lab.svg"),
    ):
        target = OUT / name
        trace(source, target)
        print(f"Wrote {target}")


if __name__ == "__main__":
    main()
