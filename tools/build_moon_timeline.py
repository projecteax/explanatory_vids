"""Build Remotion timeline from per-line audio + pause_after."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "generated" / "audio"
OUT = ROOT / "explainer" / "src" / "timeline.json"


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
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
    return float(out)


def main() -> None:
    lines = json.loads((AUDIO / "moon_dialogue.json").read_text(encoding="utf-8"))
    t = 0.0
    timeline = []
    for line in lines:
        n = line["n"]
        speaker = line["speaker"].lower()
        turn = AUDIO / "turns" / f"line_{n:02d}_{speaker}.mp3"
        dur = probe_duration(turn)
        pause = float(line.get("pause_after", 0.7))
        timeline.append(
            {
                **line,
                "start": round(t, 3),
                "duration": round(dur, 3),
                "end": round(t + dur, 3),
                "pause_after": pause,
            }
        )
        t += dur
        if n < len(lines):
            t += pause

    payload = {
        "fps": 30,
        "width": 1920,
        "height": 1080,
        "duration_seconds": round(t, 3),
        "audio": "moon_why_moon_changes_shape.mp3",
        "lines": timeline,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}  total={payload['duration_seconds']}s")


if __name__ == "__main__":
    main()
