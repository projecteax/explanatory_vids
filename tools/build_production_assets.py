"""Build the approved production sprite/vector library from generated model sheets."""
from __future__ import annotations

import json
import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
import vtracer


ROOT = Path(__file__).resolve().parents[1]
CHAT_ASSETS = Path(
    r"C:\Users\caspi\.cursor\projects\c-Users-caspi-video-generator\assets"
)
OUT = ROOT / "explainer" / "public" / "production"
FONT = Path(
    r"C:\Users\caspi\The widgeteers_website\public\fonts\mikado\MikadoBold.otf"
)
REMBG_SESSION = new_session("u2netp")

SOURCES = {
    "bravo_turnaround": CHAT_ASSETS / "bravo-production-turnaround.png",
    "pipi_turnaround": CHAT_ASSETS / "pipi-production-turnaround.png",
    "bravo_poses": CHAT_ASSETS / "bravo-acting-poses.png",
    "pipi_poses": CHAT_ASSETS / "pipi-acting-poses.png",
    "bravo_faces": CHAT_ASSETS / "bravo-viseme-expression-sheet.png",
    "pipi_faces": CHAT_ASSETS / "pipi-viseme-expression-sheet.png",
    "bravo_point": CHAT_ASSETS / "bravo-pointing-right.png",
    "bravo_present": CHAT_ASSETS / "bravo-presenting-screen.png",
    "lab_wide": CHAT_ASSETS / "lab-two-shot-plate.png",
    "lab_monitor": CHAT_ASSETS / "lab-monitor-closeup.png",
}


def remove_border_background(image: Image.Image, tolerance: float = 34) -> Image.Image:
    rgb = np.asarray(image.convert("RGB"), dtype=np.int16)
    h, w, _ = rgb.shape
    corners = np.asarray(
        [rgb[0, 0], rgb[0, w - 1], rgb[h - 1, 0], rgb[h - 1, w - 1]],
        dtype=np.float32,
    )
    bg = np.median(corners, axis=0)
    distance = np.sqrt(np.sum((rgb - bg) ** 2, axis=2))
    candidate = distance <= tolerance
    visited = np.zeros((h, w), dtype=np.bool_)
    queue: deque[tuple[int, int]] = deque()
    for x in range(w):
        queue.extend(((0, x), (h - 1, x)))
    for y in range(h):
        queue.extend(((y, 0), (y, w - 1)))
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
    alpha = np.where(visited, 0, 255).astype(np.uint8)
    rgba = np.dstack([rgb.astype(np.uint8), alpha])
    return Image.fromarray(rgba, "RGBA")


def trim(image: Image.Image, padding: int = 8) -> Image.Image:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if not box:
        return image
    left, top, right, bottom = box
    return image.crop(
        (
            max(0, left - padding),
            max(0, top - padding),
            min(image.width, right + padding),
            min(image.height, bottom + padding),
        )
    )


def trace(source: Path, target: Path) -> None:
    vtracer.convert_image_to_svg_py(
        str(source),
        str(target),
        colormode="color",
        hierarchical="stacked",
        mode="spline",
        filter_speckle=5,
        color_precision=7,
        layer_difference=12,
        corner_threshold=60,
        length_threshold=4.0,
        max_iterations=10,
        splice_threshold=45,
        path_precision=5,
    )


def export_sprite(
    source: Path,
    name: str,
    box: tuple[int, int, int, int] | None = None,
    *,
    tolerance: float = 34,
    ai_matting: bool = False,
) -> dict[str, str]:
    image = Image.open(source).convert("RGB")
    scaled_box = None
    if box:
        sx = image.width / 1024
        sy = image.height / 576
        scaled_box = (
            round(box[0] * sx),
            round(box[1] * sy),
            round(box[2] * sx),
            round(box[3] * sy),
        )
    if ai_matting:
        if scaled_box:
            image = image.crop(scaled_box)
        image = remove(image, session=REMBG_SESSION)
    else:
        image = remove_border_background(image, tolerance=tolerance)
        if scaled_box:
            image = image.crop(scaled_box)
    image = trim(image)
    png = OUT / f"{name}.png"
    svg = OUT / f"{name}.svg"
    image.save(png)
    trace(png, svg)
    return {
        "png": f"production/{png.name}",
        "svg": f"production/{svg.name}",
    }


def main() -> None:
    missing = [str(path) for path in SOURCES.values() if not path.exists()]
    if missing:
        raise SystemExit("Missing generated sources:\n" + "\n".join(missing))
    if not FONT.exists():
        raise SystemExit(f"Missing Mikado font: {FONT}")

    OUT.mkdir(parents=True, exist_ok=True)
    source_dir = OUT / "source"
    source_dir.mkdir(exist_ok=True)
    for name, source in SOURCES.items():
        shutil.copy2(source, source_dir / f"{name}{source.suffix.lower()}")
    shutil.copy2(FONT, OUT / "MikadoBold.otf")

    manifest: dict[str, object] = {
        "font": "production/MikadoBold.otf",
        "labs": {},
        "bravo": {"views": {}, "poses": {}, "faces": {}, "visemes": {}},
        "pipi": {"views": {}, "poses": {}, "faces": {}, "visemes": {}},
    }

    labs = manifest["labs"]
    assert isinstance(labs, dict)
    for key in ("lab_wide", "lab_monitor"):
        target = OUT / f"{key}.png"
        Image.open(SOURCES[key]).convert("RGB").save(target, quality=97)
        labs[key.removeprefix("lab_")] = f"production/{target.name}"

    bravo = manifest["bravo"]
    assert isinstance(bravo, dict)
    bravo["poses"] = {
        "point": export_sprite(
            SOURCES["bravo_point"],
            "bravo-pose-point",
            tolerance=70,
            ai_matting=True,
        ),
        "present": export_sprite(
            SOURCES["bravo_present"],
            "bravo-pose-present",
            tolerance=70,
            ai_matting=True,
        ),
    }
    bravo_pose_boxes = {
        "listen": (16, 55, 166, 540),
        "open_palm": (170, 50, 325, 540),
        "chuckle": (330, 45, 495, 540),
        "hold_moon": (695, 45, 855, 540),
        "think_profile": (865, 45, 1015, 540),
    }
    for name, box in bravo_pose_boxes.items():
        bravo["poses"][name] = export_sprite(
            SOURCES["bravo_poses"],
            f"bravo-pose-{name}",
            box,
            tolerance=70,
            ai_matting=True,
        )

    bravo_view_boxes = {
        "front": (70, 165, 195, 560),
        "three_quarter": (265, 165, 395, 560),
        "profile": (445, 165, 575, 560),
        "rear_three_quarter": (625, 165, 770, 560),
        "back": (820, 165, 955, 560),
    }
    for name, box in bravo_view_boxes.items():
        bravo["views"][name] = export_sprite(
            SOURCES["bravo_turnaround"],
            f"bravo-view-{name}",
            box,
            tolerance=70,
            ai_matting=True,
        )

    bravo_expression_names = [
        "neutral",
        "worried",
        "amused",
        "curious",
        "surprised",
        "teacher",
    ]
    for index, name in enumerate(bravo_expression_names):
        centers = [86, 254, 420, 586, 754, 922]
        left = max(0, centers[index] - 74)
        right = min(1024, centers[index] + 74)
        bravo["faces"][name] = export_sprite(
            SOURCES["bravo_faces"],
            f"bravo-face-{name}",
            (left, 28, right, 262),
            tolerance=70,
            ai_matting=True,
        )

    bravo_viseme_names = ["X", "F", "L", "A", "E", "O", "U", "G"]
    for index, name in enumerate(bravo_viseme_names):
        centers = [65, 192, 320, 448, 576, 704, 833, 960]
        left = max(0, centers[index] - 58)
        right = min(1024, centers[index] + 58)
        bravo["visemes"][name] = export_sprite(
            SOURCES["bravo_faces"],
            f"bravo-viseme-{name}",
            (left, 292, right, 514),
            tolerance=70,
            ai_matting=True,
        )

    pipi = manifest["pipi"]
    assert isinstance(pipi, dict)
    pipi_pose_boxes = {
        "alarm": (18, 60, 300, 290),
        "suspicious": (325, 55, 635, 290),
        "listen": (665, 55, 1010, 290),
        "profile": (75, 310, 350, 560),
        "laugh": (390, 300, 660, 560),
        "point": (680, 300, 1010, 560),
    }
    for name, box in pipi_pose_boxes.items():
        pipi["poses"][name] = export_sprite(
            SOURCES["pipi_poses"], f"pipi-pose-{name}", box, tolerance=100
        )

    pipi_view_boxes = {
        "front": (5, 75, 205, 305),
        "three_quarter": (205, 75, 405, 305),
        "profile": (405, 70, 610, 305),
        "rear_three_quarter": (610, 70, 810, 305),
        "back": (810, 70, 1015, 305),
    }
    for name, box in pipi_view_boxes.items():
        pipi["views"][name] = export_sprite(
            SOURCES["pipi_turnaround"], f"pipi-view-{name}", box, tolerance=100
        )

    pipi_expression_names = [
        "neutral",
        "alarm",
        "suspicious",
        "curious",
        "laugh",
        "focused",
    ]
    for index, name in enumerate(pipi_expression_names):
        centers = [85, 252, 420, 588, 755, 922]
        left = max(0, centers[index] - 75)
        right = min(1024, centers[index] + 75)
        pipi["faces"][name] = export_sprite(
            SOURCES["pipi_faces"],
            f"pipi-face-{name}",
            (left, 105, right, 282),
            tolerance=100,
        )

    pipi_viseme_names = ["X", "A", "E", "O", "U", "F", "G"]
    for index, name in enumerate(pipi_viseme_names):
        centers = [75, 225, 375, 525, 675, 825, 970]
        left = max(0, centers[index] - 65)
        right = min(1024, centers[index] + 65)
        pipi["visemes"][name] = export_sprite(
            SOURCES["pipi_faces"],
            f"pipi-viseme-{name}",
            (left, 318, right, 505),
            tolerance=100,
        )

    manifest_path = OUT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {manifest_path}")


if __name__ == "__main__":
    main()
