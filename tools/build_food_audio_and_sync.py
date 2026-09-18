"""Create food episode master wav, timeline, and Rhubarb mouth cues."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "generated" / "audio"
TURNS = AUDIO / "food_turns"
PUBLIC_AUDIO = ROOT / "explainer" / "public" / "audio"
PUBLIC_DATA = ROOT / "explainer" / "src" / "food-data"
RHUBARB = (
    ROOT
    / "tools"
    / "rhubarb"
    / "Rhubarb-Lip-Sync-1.14.0-Windows"
    / "rhubarb.exe"
)


def probe(path: Path) -> float:
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


def spoken(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]+\]", "", text)).strip()


def main() -> None:
    PUBLIC_AUDIO.mkdir(parents=True, exist_ok=True)
    PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
    lines = json.loads((AUDIO / "food_dialogue.json").read_text(encoding="utf-8"))

    ffmpeg: list[str] = ["ffmpeg", "-y"]
    labels: list[str] = []
    timeline: list[dict] = []
    transcript_lines: list[str] = []
    t = 0.0
    input_index = 0

    for i, line in enumerate(lines):
        turn = TURNS / f"line_{line['n']:02d}_{line['speaker'].lower()}.mp3"
        duration = probe(turn)
        clean_text = spoken(line["elevenlabs_text"])
        transcript_lines.append(clean_text)
        timeline.append(
            {
                **line,
                "spoken_text": clean_text,
                "start": round(t, 3),
                "duration": round(duration, 3),
                "end": round(t + duration, 3),
            }
        )
        ffmpeg.extend(["-i", str(turn)])
        labels.append(f"[{input_index}:a]")
        input_index += 1
        t += duration

        pause = float(line.get("pause_after", 0.3))
        if i < len(lines) - 1 and pause > 0:
            ffmpeg.extend(
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
            t += pause

    master_wav = PUBLIC_AUDIO / "food_full_clean.wav"
    graph = "".join(labels) + f"concat=n={len(labels)}:v=0:a=1[out]"
    ffmpeg.extend(
        [
            "-filter_complex",
            graph,
            "-map",
            "[out]",
            "-ar",
            "48000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(master_wav),
        ]
    )
    subprocess.run(ffmpeg, check=True)

    transcript = PUBLIC_DATA / "transcript.txt"
    transcript.write_text("\n".join(transcript_lines), encoding="utf-8")

    rhubarb_out = PUBLIC_DATA / "mouth-cues.json"
    subprocess.run(
        [
            str(RHUBARB),
            "-f",
            "json",
            "-o",
            str(rhubarb_out),
            "--dialogFile",
            str(transcript),
            str(master_wav),
        ],
        check=True,
    )

    payload = {
        "fps": 30,
        "width": 1920,
        "height": 1080,
        "duration_seconds": round(t, 3),
        "audio": "audio/food_full_clean.wav",
        "lines": timeline,
    }
    (PUBLIC_DATA / "timeline.json").write_text(
        json.dumps(payload, indent=2), encoding="utf-8"
    )
    print(f"Wrote clean master ({probe(master_wav):.3f}s), timeline and Rhubarb cues")


if __name__ == "__main__":
    main()
