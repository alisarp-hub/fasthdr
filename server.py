from __future__ import annotations

import io
import re
import zipfile
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
from flask import Flask, Response, jsonify, request, send_from_directory


APP_DIR = Path(__file__).resolve().parent
MAX_SIDE = 2400

app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = 6 * 1024 * 1024 * 1024


@dataclass
class PhotoFile:
    name: str
    data: bytes


@dataclass
class HdrSet:
    name: str
    low: PhotoFile
    mid: PhotoFile
    high: PhotoFile


def luminance(bgr: np.ndarray) -> np.ndarray:
    b, g, r = cv2.split(bgr.astype(np.float32) / 255.0)
    return 0.0722 * b + 0.7152 * g + 0.2126 * r


def smoothstep(edge0: float, edge1: float, value: np.ndarray) -> np.ndarray:
    x = np.clip((value - edge0) / max(1e-6, edge1 - edge0), 0, 1)
    return x * x * (3 - 2 * x)


def to_u8(image: np.ndarray) -> np.ndarray:
    return np.clip(image * 255.0 + 0.5, 0, 255).astype(np.uint8)


def decode_photo(photo: PhotoFile) -> np.ndarray:
    raw = np.frombuffer(photo.data, dtype=np.uint8)
    image = cv2.imdecode(raw, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"{photo.name} okunamadi")

    h, w = image.shape[:2]
    scale = min(1.0, MAX_SIDE / max(h, w))
    if scale < 1:
        image = cv2.resize(image, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_AREA)
    return image


def exposure_label(name: str) -> str | None:
    lower = name.lower()
    if re.search(r"(^|[^a-z])(low|under|dark|dusuk)([^a-z]|$)", lower):
        return "low"
    if re.search(r"(^|[^a-z])(mid|middle|normal|orta)([^a-z]|$)", lower):
        return "mid"
    if re.search(r"(^|[^a-z])(high|over|bright|yuksek)([^a-z]|$)", lower):
        return "high"
    return None


def scene_key(name: str) -> str:
    key = re.sub(r"\.[^.]+$", "", name)
    key = re.sub(r"(^|[^a-z])(low|under|dark|dusuk|mid|middle|normal|orta|high|over|bright|yuksek)([^a-z]|$)", "_", key, flags=re.I)
    key = re.sub(r"[_\s-]+", "_", key).strip("_")
    return re.sub(r"[^a-z0-9_-]+", "_", key, flags=re.I) or "scene"


def sort_photos(photos: list[PhotoFile]) -> list[PhotoFile]:
    return sorted(photos, key=lambda item: item.name.lower())


def group_photos(photos: list[PhotoFile]) -> list[HdrSet]:
    photos = sort_photos(photos)
    named: dict[str, dict[str, PhotoFile]] = {}
    has_all_labels = True

    for photo in photos:
        label = exposure_label(photo.name)
        if label is None:
            has_all_labels = False
            break
        named.setdefault(scene_key(photo.name), {})[label] = photo

    if has_all_labels:
        groups = []
        for key in sorted(named.keys()):
            item = named[key]
            if {"low", "mid", "high"} <= set(item.keys()):
                groups.append(HdrSet(key, item["low"], item["mid"], item["high"]))
        if groups:
            return groups

    groups = []
    for index in range(0, len(photos) - 2, 3):
        low, mid, high = photos[index : index + 3]
        groups.append(HdrSet(scene_key(mid.name), low, mid, high))
    return groups


def order_by_brightness(images: list[np.ndarray]) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    scored = sorted(((float(luminance(img).mean()), img) for img in images), key=lambda item: item[0])
    return scored[0][1], scored[1][1], scored[2][1]


def align_images(images: list[np.ndarray]) -> list[np.ndarray]:
    aligned = [img.copy() for img in images]
    try:
        align = cv2.createAlignMTB(max_bits=6, exclude_range=4, cut=True)
        result: list[np.ndarray] = []
        align.process(aligned, result)
        if len(result) == 3:
            return result
    except Exception:
        pass
    return aligned


def gray_world(image: np.ndarray, strength: float = 0.18) -> np.ndarray:
    arr = image.astype(np.float32)
    means = arr.reshape(-1, 3).mean(axis=0)
    target = means.mean()
    gain = target / np.maximum(means, 1)
    gain = 1 + (gain - 1) * strength
    return np.clip(arr * gain, 0, 255).astype(np.uint8)


def blend_window(base: np.ndarray, dark: np.ndarray, mid: np.ndarray, amount: float = 0.86) -> np.ndarray:
    mid_y = luminance(mid)
    dark_y = luminance(dark)
    mask = np.clip((mid_y - 0.70) / 0.24, 0, 1)
    recoverable = np.clip((0.92 - dark_y) / 0.18, 0, 1)
    mask = cv2.GaussianBlur(np.clip(mask * recoverable, 0, 1), (0, 0), 7)

    base_f = base.astype(np.float32) / 255.0
    dark_f = dark.astype(np.float32) / 255.0
    recovered = np.clip(dark_f**0.72 * 1.08, 0, 1)
    return to_u8(base_f * (1 - mask[..., None] * amount) + recovered * (mask[..., None] * amount))


def finish_real_estate(image: np.ndarray) -> np.ndarray:
    f = gray_world(image, 0.18).astype(np.float32) / 255.0
    y = 0.0722 * f[..., 0] + 0.7152 * f[..., 1] + 0.2126 * f[..., 2]

    lifted = np.clip(f**0.68, 0, 1)
    lift_mask = (1 - smoothstep(0.58, 0.94, y))[..., None]
    f = f * (1 - lift_mask * 0.52) + lifted * (lift_mask * 0.52)

    y = 0.0722 * f[..., 0] + 0.7152 * f[..., 1] + 0.2126 * f[..., 2]
    highlight = smoothstep(0.78, 1.0, y)[..., None]
    compressed = np.clip(f**1.10, 0, 1)
    f = f * (1 - highlight * 0.16) + compressed * (highlight * 0.16)

    f = np.clip((f - 0.5) * 1.03 + 0.5, 0, 1)
    out = to_u8(f)

    hsv = cv2.cvtColor(out, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[..., 1] *= 1.035
    out = cv2.cvtColor(np.clip(hsv, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)

    blur = cv2.GaussianBlur(out.astype(np.float32), (0, 0), 1.0)
    out = np.clip(out.astype(np.float32) + (out.astype(np.float32) - blur) * 0.12, 0, 255).astype(np.uint8)
    return out


def merge_real_estate(hdr_set: HdrSet) -> bytes:
    decoded = [decode_photo(hdr_set.low), decode_photo(hdr_set.mid), decode_photo(hdr_set.high)]
    dark, mid, bright = order_by_brightness(decoded)
    dark, mid, bright = align_images([dark, mid, bright])

    mertens = cv2.createMergeMertens(0.85, 0.08, 1.75)
    base = to_u8(mertens.process([dark, mid, bright]))
    base = blend_window(base, dark, mid, 0.86)
    final = finish_real_estate(base)

    ok, encoded = cv2.imencode(".jpg", final, [cv2.IMWRITE_JPEG_QUALITY, 95, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    if not ok:
        raise ValueError("JPG ciktisi olusturulamadi")
    return encoded.tobytes()


@app.get("/")
def index() -> Response:
    return send_from_directory(APP_DIR, "index.html")


@app.get("/<path:name>")
def assets(name: str) -> Response:
    return send_from_directory(APP_DIR, name)


@app.post("/api/merge")
def merge_endpoint() -> Response:
    uploads = request.files.getlist("photos")
    photos = [PhotoFile(file.filename or f"photo_{i}.jpg", file.read()) for i, file in enumerate(uploads)]
    photos = [photo for photo in photos if photo.data]
    groups = group_photos(photos)

    if not groups:
        return jsonify({"error": "En az 3 fotograf yukle. Sira: low, middle, high."}), 400

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED, compresslevel=4) as archive:
        for index, hdr_set in enumerate(groups, start=1):
            result = merge_real_estate(hdr_set)
            archive.writestr(f"HDR_{index:04d}_{hdr_set.name}.jpg", result)

    zip_buffer.seek(0)
    return Response(
        zip_buffer.getvalue(),
        mimetype="application/zip",
        headers={"Content-Disposition": f'attachment; filename="real-estate-hdr-{len(groups)}-set.zip"'},
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=4174, threaded=True)
