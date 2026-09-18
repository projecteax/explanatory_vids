"""Build a clean, timestamp-safe first-30-second audio track.

The master MP3 is intentionally assembled from independently generated turns.
Concatenating MP3 byte streams leaves repeated headers, so this helper decodes
the original turns and pauses, concatenates PCM, and emits one clean AAC file.
"""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "generated" / "audio"
OUT = AUDIO / "moon_30s_clean.m4a"


def duration(path: Path) -> float:
    value = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(value)


def main() -> None:
    lines = json.loads((AUDIO / "moon_dialogue.json").read_text(encoding="utf-8"))
    args: list[str] = ["ffmpeg", "-y"]
    labels: list[str] = []
    input_index = 0
    elapsed = 0.0

    for line in lines:
        if elapsed >= 30:
            break
        turn = AUDIO / "turns" / (
            f"line_{line['n']:02d}_{line['speaker'].lower()}.mp3"
        )
        args.extend(["-i", str(turn)])
        labels.append(f"[{input_index}:a]")
        input_index += 1
        elapsed += duration(turn)

        pause = float(line.get("pause_after", 0.7))
        if pause > 0 and elapsed < 30:
            args.extend(
                [
                    "-f",
                    "lavfi",
                    "-t",
                    f"{pause:.3f}",
                    "-i",
                    "anullsrc=r=44100:cl=mono",
                ]
            )
            labels.append(f"[{input_index}:a]")
            input_index += 1
            elapsed += pause

    graph = "".join(labels) + f"concat=n={len(labels)}:v=0:a=1[out]"
    args.extend(
        [
            "-filter_complex",
            graph,
            "-map",
            "[out]",
            "-t",
            "30",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            str(OUT),
        ]
    )
    subprocess.run(args, check=True)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
