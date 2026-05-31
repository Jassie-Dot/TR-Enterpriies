from __future__ import annotations

import base64
import hashlib
import io
import json
import re
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "assets" / "images"
OPTIMIZED_DIR = IMAGE_DIR / "optimized"
MANIFEST_PATH = ROOT / "data" / "image-manifest.json"
WIDTHS = (320, 480, 640, 960, 1280, 1600, 1920)
SUPPORTED = {".jpg", ".jpeg", ".png"}


def slugify(path: Path) -> str:
    stem = re.sub(r"[^a-z0-9]+", "-", path.stem.lower()).strip("-")
    digest = hashlib.sha1(path.name.encode("utf-8")).hexdigest()[:7]
    return f"{stem or 'image'}-{digest}"


def public_path(path: Path) -> str:
    return "/" + path.relative_to(ROOT).as_posix()


def variant_widths(width: int) -> list[int]:
    values = [candidate for candidate in WIDTHS if candidate < width]
    values.append(width)
    return sorted(set(values))


def convert_for_save(image: Image.Image) -> Image.Image:
    if image.mode in {"RGBA", "LA"}:
        return image
    if image.mode == "P" and "transparency" in image.info:
        return image.convert("RGBA")
    return image.convert("RGB")


def save_variant(image: Image.Image, output: Path, fmt: str) -> int:
    output.parent.mkdir(parents=True, exist_ok=True)
    if fmt == "webp":
        image.save(output, "WEBP", quality=76, method=6)
    elif fmt == "avif":
        image.save(output, "AVIF", quality=54, speed=6)
    return output.stat().st_size


def make_placeholder(image: Image.Image) -> str:
    placeholder = ImageOps.exif_transpose(image).copy()
    placeholder.thumbnail((24, 24), Image.Resampling.LANCZOS)
    placeholder = placeholder.filter(ImageFilter.GaussianBlur(1.5)).convert("RGB")
    buffer = io.BytesIO()
    placeholder.save(buffer, "WEBP", quality=38, method=6)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/webp;base64,{encoded}"


def build_manifest() -> dict[str, dict]:
    OPTIMIZED_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}

    for path in sorted(IMAGE_DIR.iterdir()):
        if path.is_dir() or path.suffix.lower() not in SUPPORTED:
            continue

        with Image.open(path) as raw:
            image = ImageOps.exif_transpose(raw)
            width, height = image.size
            slug = slugify(path)
            original_public_path = public_path(path)
            webp_variants = []
            avif_variants = []

            for target_width in variant_widths(width):
                if target_width == width:
                    resized = image.copy()
                else:
                    target_height = max(1, round(height * (target_width / width)))
                    resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)

                resized = convert_for_save(resized)
                webp_path = OPTIMIZED_DIR / f"{slug}-{target_width}.webp"
                avif_path = OPTIMIZED_DIR / f"{slug}-{target_width}.avif"
                webp_size = save_variant(resized, webp_path, "webp")
                avif_size = save_variant(resized, avif_path, "avif")

                webp_variants.append({
                    "src": public_path(webp_path),
                    "width": target_width,
                    "bytes": webp_size,
                })
                avif_variants.append({
                    "src": public_path(avif_path),
                    "width": target_width,
                    "bytes": avif_size,
                })

            manifest[original_public_path] = {
                "width": width,
                "height": height,
                "bytes": path.stat().st_size,
                "placeholder": make_placeholder(image),
                "formats": {
                    "avif": avif_variants,
                    "webp": webp_variants,
                },
            }

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    manifest = build_manifest()
    total_variants = sum(
        len(entry["formats"]["avif"]) + len(entry["formats"]["webp"])
        for entry in manifest.values()
    )
    print(f"Generated metadata for {len(manifest)} images and {total_variants} optimized variants.")
