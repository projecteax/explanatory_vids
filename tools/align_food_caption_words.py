"""Align food episode script words to per-turn audio."""
from __future__ import annotations

import difflib
import json
import re
from pathlib import Path

from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
AUDIO = ROOT / "generated" / "audio" / "food_turns"
DATA = ROOT / "explainer" / "src" / "food-data"


def normalize(value: str) -> str:
    return re.sub(r"[^a-z0-9']", "", value.lower())


def distribute(words: list[str], start: float, end: float) -> list[dict]:
    weights = [max(1.0, len(normalize(word)) ** 0.72) for word in words]
    total = sum(weights)
    cursor = start
    output = []
    for word, weight in zip(words, weights):
        duration = (end - start) * weight / total
        output.append(
            {
                "word": word,
                "start": round(cursor, 3),
                "end": round(cursor + duration, 3),
            }
        )
        cursor += duration
    return output


def align_exact(
    target_words: list[str],
    recognized: list[dict],
    duration: float,
) -> list[dict]:
    if not recognized:
        return distribute(target_words, 0.0, duration)

    target_norm = [normalize(word) for word in target_words]
    heard_norm = [normalize(word["word"]) for word in recognized]
    matcher = difflib.SequenceMatcher(a=target_norm, b=heard_norm, autojunk=False)
    aligned: list[dict | None] = [None] * len(target_words)

    for block in matcher.get_matching_blocks():
        for offset in range(block.size):
            target_index = block.a + offset
            heard = recognized[block.b + offset]
            aligned[target_index] = {
                "word": target_words[target_index],
                "start": float(heard["start"]),
                "end": float(heard["end"]),
            }

    index = 0
    while index < len(aligned):
        if aligned[index] is not None:
            index += 1
            continue
        run_start = index
        while index < len(aligned) and aligned[index] is None:
            index += 1
        run_end = index
        left = aligned[run_start - 1]["end"] if run_start else 0.0
        right = aligned[run_end]["start"] if run_end < len(aligned) else duration
        generated = distribute(target_words[run_start:run_end], float(left), float(right))
        aligned[run_start:run_end] = generated

    return [
        {
            "word": item["word"],
            "start": round(max(0.0, float(item["start"])), 3),
            "end": round(min(duration, float(item["end"])), 3),
        }
        for item in aligned
        if item is not None
    ]


def main() -> None:
    timeline = json.loads((DATA / "timeline.json").read_text(encoding="utf-8"))
    model = WhisperModel("base.en", device="cpu", compute_type="int8")
    output_lines = []

    for line in timeline["lines"]:
        turn = AUDIO / f"line_{line['n']:02d}_{line['speaker'].lower()}.mp3"
        segments, _ = model.transcribe(
            str(turn),
            language="en",
            beam_size=5,
            word_timestamps=True,
            vad_filter=False,
            initial_prompt=line["spoken_text"],
            condition_on_previous_text=False,
        )
        heard = []
        for segment in segments:
            for word in segment.words or []:
                heard.append(
                    {
                        "word": word.word.strip(),
                        "start": float(word.start),
                        "end": float(word.end),
                        "probability": float(word.probability),
                    }
                )
        target_words = line["spoken_text"].split()
        exact = align_exact(target_words, heard, float(line["duration"]))
        absolute = [
            {
                **word,
                "start": round(float(word["start"]) + float(line["start"]), 3),
                "end": round(float(word["end"]) + float(line["start"]), 3),
            }
            for word in exact
        ]
        output_lines.append(
            {
                "n": line["n"],
                "speaker": line["speaker"],
                "start": line["start"],
                "end": line["end"],
                "words": absolute,
            }
        )
        print(
            f"{line['n']:02d} {line['speaker']:5} "
            f"script={len(target_words):2d} recognized={len(heard):2d}"
        )

    out = DATA / "word-timings.json"
    out.write_text(json.dumps(output_lines, indent=2), encoding="utf-8")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
