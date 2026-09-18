"""Generate restrained educational SFX and mix the final episode audio."""
from __future__ import annotations

import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "explainer" / "src" / "production-data" / "timeline.json"
PUBLIC_AUDIO = ROOT / "explainer" / "public" / "audio"
RATE = 48_000


def tone(
    track: np.ndarray,
    start: float,
    duration: float,
    frequency: float,
    amplitude: float,
    *,
    glide: float = 0,
) -> None:
    first = round(start * RATE)
    count = min(round(duration * RATE), len(track) - first)
    if count <= 0:
        return
    t = np.arange(count, dtype=np.float32) / RATE
    phase = 2 * math.pi * (frequency * t + 0.5 * glide * t * t)
    envelope = np.clip(
        np.sin(np.linspace(0, math.pi, count, dtype=np.float32)), 0, 1
    ) ** 1.6
    track[first : first + count] += np.sin(phase) * envelope * amplitude


def chime(track: np.ndarray, start: float, base: float, amplitude: float = 0.08) -> None:
    tone(track, start, 0.16, base, amplitude)
    tone(track, start + 0.11, 0.19, base * 1.25, amplitude * 0.8)
    tone(track, start + 0.23, 0.25, base * 1.5, amplitude * 0.62)


def main() -> None:
    timeline = json.loads(DATA.read_text(encoding="utf-8"))
    duration = float(timeline["duration_seconds"])
    track = np.zeros(round(duration * RATE), dtype=np.float32)

    # Pipi's opening alarm: short and readable under dialogue.
    tone(track, 0.10, 0.13, 720, 0.08)
    tone(track, 0.34, 0.13, 880, 0.08)
    tone(track, 0.58, 0.18, 1040, 0.07)

    science_reveals = [24.9, 43.5, 57.2, 68.7, 85.0, 105.0, 122.6, 133.0]
    for index, start in enumerate(science_reveals):
        chime(track, start + 0.18, 520 + (index % 3) * 45, 0.045)

    comedy_beats = [20.8, 39.0, 78.4, 100.2, 114.4, 145.1, 165.2]
    for start in comedy_beats:
        tone(track, start, 0.16, 310, 0.045, glide=420)

    # Resolve and end-card sparkle.
    chime(track, 174.9, 660, 0.065)
    chime(track, 179.15, 740, 0.055)

    peak = float(np.max(np.abs(track)))
    if peak > 0.92:
        track *= 0.92 / peak
    pcm = np.int16(np.clip(track, -1, 1) * 32767)
    sfx = PUBLIC_AUDIO / "moon_sfx.wav"
    with wave.open(str(sfx), "wb") as stream:
        stream.setnchannels(1)
        stream.setsampwidth(2)
        stream.setframerate(RATE)
        stream.writeframes(pcm.tobytes())

    master = PUBLIC_AUDIO / "moon_full_clean.wav"
    mixed = PUBLIC_AUDIO / "moon_final_mix.m4a"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(master),
            "-i",
            str(sfx),
            "-filter_complex",
            "[0:a]volume=1.0[voice];[1:a]volume=0.82[sfx];"
            "[voice][sfx]amix=inputs=2:duration=first:normalize=0,"
            "alimiter=limit=0.95[out]",
            "-map",
            "[out]",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            str(mixed),
        ],
        check=True,
    )
    print(f"Wrote {mixed}")


if __name__ == "__main__":
    main()
