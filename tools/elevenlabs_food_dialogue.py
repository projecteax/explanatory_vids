#!/usr/bin/env python3
"""Widgeteers Explains: Everyday Food and Sometimes Food — ElevenLabs v3 TTS.

Approved kids-screenwriter draft: Bravo ~86% of words, Pipi 5 jokes,
everyday vs sometimes, sugar crash + teeth as separate beats, soda as a
sometimes sip, factory snacks, wash produce, six named foods with jobs.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "generated" / "audio"
DIALOGUE_JSON = OUT_DIR / "food_dialogue.json"
DIALOGUE_TXT = OUT_DIR / "food_dialogue_elevenlabs.txt"
VOICES_CFG = ROOT / "tools" / "elevenlabs_voices.json"
MP3_OUT = OUT_DIR / "food_why_we_eat.mp3"
TURNS = OUT_DIR / "food_turns"

DEFAULT_VOICES = {
    "BRAVO": "Bravo American EN",
    "PIPI": "Pipi",
}

LINES: list[dict] = [
    {
        "n": 1,
        "speaker": "PIPI",
        "scene": "01",
        "paren": "(excited, beeping)",
        "text": "Bravo! Super fuel! Candy bar plus soda! Zoom zoom forever!",
        "elevenlabs_text": (
            "[excited][beeping] Bravo! Super fuel! [proud] Candy bar plus soda! "
            "[giggles] Zoom zoom forever!"
        ),
        "pause_after": 0.35,
    },
    {
        "n": 2,
        "speaker": "BRAVO",
        "scene": "01",
        "paren": "(warm, amused)",
        "text": "Candy can be a treat. Treats are sometimes food. Everyday food is the food you eat most days. Let's check the chalkboard.",
        "elevenlabs_text": (
            "[amused][warm] Candy can be a treat. [clear] Treats are sometimes food. "
            "[gentle] Everyday food is the food you eat most days. "
            "[curious] Let's check the chalkboard."
        ),
        "pause_after": 0.3,
    },
    {
        "n": 3,
        "speaker": "BRAVO",
        "scene": "02",
        "paren": "",
        "text": "Everyday food looks like this. An apple. A carrot. A banana. Broccoli. Eggs. Bread. They give energy to play, food to grow, and tiny helpers that keep you well.",
        "elevenlabs_text": (
            "[teacher] Everyday food looks like this. [pause] An apple. A carrot. "
            "A banana. Broccoli. Eggs. Bread. [warm] They give energy to play, "
            "food to grow, and tiny helpers that keep you well."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 4,
        "speaker": "BRAVO",
        "scene": "02",
        "paren": "",
        "text": "Bite an apple. It is sweet from the tree. The chewy bits help your tummy. Like a tiny broom, sweeping food along. That is why fruit is not the same as candy.",
        "elevenlabs_text": (
            "[clear] Bite an apple. It is sweet from the tree. [pause] "
            "The chewy bits help your tummy. [playful] Like a tiny broom, "
            "sweeping food along. [happy] That is why fruit is not the same as candy."
        ),
        "pause_after": 0.3,
    },
    {
        "n": 5,
        "speaker": "PIPI",
        "scene": "02",
        "paren": "(delighted)",
        "text": "Tummy broom! Sweep sweep apple!",
        "elevenlabs_text": (
            "[delighted] Tummy broom! [laughs] Sweep sweep apple! [beeps happily]"
        ),
        "pause_after": 0.28,
    },
    {
        "n": 6,
        "speaker": "BRAVO",
        "scene": "03",
        "paren": "",
        "text": "Now candy. It is packed with sugar. Sugar is a FAST zap. You feel zoomy... then crash. Tired. Grumpy. The zoom runs out.",
        "elevenlabs_text": (
            "[firm but kind] Now candy. It is packed with sugar. [pause] "
            "Sugar is a FAST zap. [excited] You feel zoomy... [soft] then crash. "
            "Tired. Grumpy. [clear] The zoom runs out."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 7,
        "speaker": "BRAVO",
        "scene": "03",
        "paren": "",
        "text": "Sugar also sticks on teeth. Tiny germs eat that sugar. Then they make holes. So sweets are sometimes food. Not everyday food.",
        "elevenlabs_text": (
            "[clear] Sugar also sticks on teeth. [pause] Tiny germs eat that sugar. "
            "Then they make holes. [gentle] So sweets are sometimes food. "
            "Not everyday food."
        ),
        "pause_after": 0.3,
    },
    {
        "n": 8,
        "speaker": "PIPI",
        "scene": "03",
        "paren": "(horrified comedy)",
        "text": "Holes in Bravo teeth? Do not want a Swiss-cheese smile!",
        "elevenlabs_text": (
            "[horrified comedy][gasps] Holes in Bravo teeth? "
            "[worried] Do not want a Swiss-cheese smile!"
        ),
        "pause_after": 0.28,
    },
    {
        "n": 9,
        "speaker": "BRAVO",
        "scene": "04",
        "paren": "",
        "text": "Soda is sneakier. It looks like a drink. It is water plus a sugar storm plus bubbles. Your body asked for water. Water is the real drink. Milk too. Soda is a sometimes sip.",
        "elevenlabs_text": (
            "[nodding] Soda is sneakier. [pause] It looks like a drink. "
            "[clear] It is water plus a sugar storm plus bubbles. "
            "[warm] Your body asked for water. [firm] Water is the real drink. "
            "Milk too. [gentle] Soda is a sometimes sip."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 10,
        "speaker": "BRAVO",
        "scene": "04",
        "paren": "",
        "text": "Some snacks are changed in a factory. Chips. Packaged sweets. Extra sugar, extra salt, extra oil. They last on a shelf and shout at your tongue. Tummy fills up... helpers never arrive. Sometimes food. Not everyday food.",
        "elevenlabs_text": (
            "[teacher] Some snacks are changed in a factory. [pause] Chips. "
            "Packaged sweets. Extra sugar, extra salt, extra oil. [clear] "
            "They last on a shelf and shout at your tongue. [gentle] "
            "Tummy fills up... helpers never arrive. [firm] Sometimes food. "
            "Not everyday food."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 11,
        "speaker": "PIPI",
        "scene": "04",
        "paren": "(caught)",
        "text": "Sometimes was my every day. Candy goes in the sometimes box.",
        "elevenlabs_text": (
            "[caught][guilty] Sometimes... was my every day. [sighs] "
            "Candy goes in the sometimes box. [small beep]"
        ),
        "pause_after": 0.3,
    },
    {
        "n": 12,
        "speaker": "BRAVO",
        "scene": "05",
        "paren": "",
        "text": "One more job. Wash fruits and veggies BEFORE you eat them. Dirt, dust, and tiny germs ride on the skin. People touch them at the store. Rub under clean water. No soap. Then they are ready.",
        "elevenlabs_text": (
            "[bright] One more job. [pause] Wash fruits and veggies BEFORE you eat them. "
            "[clear] Dirt, dust, and tiny germs ride on the skin. "
            "People touch them at the store. [warm] Rub under clean water. "
            "No soap. Then they are ready."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 13,
        "speaker": "PIPI",
        "scene": "05",
        "paren": "",
        "text": "Pipi licks apples. Licking is not washing. Water first.",
        "elevenlabs_text": (
            "[proud] Pipi licks apples. [pause][accepting] Licking is not washing. "
            "[beeps softly] Water first."
        ),
        "pause_after": 0.28,
    },
    {
        "n": 14,
        "speaker": "BRAVO",
        "scene": "05",
        "paren": "",
        "text": "Rainbow plate. Red apple helps your tummy. Orange carrot helps you see. Yellow banana gives energy that lasts. Green broccoli helps you stay well. Eggs help you grow. Bread helps you run and play.",
        "elevenlabs_text": (
            "[excited] Rainbow plate. [warm] Red apple helps your tummy. "
            "Orange carrot helps you see. Yellow banana gives energy that lasts. "
            "Green broccoli helps you stay well. Eggs help you grow. "
            "Bread helps you run and play."
        ),
        "pause_after": 0.35,
    },
    {
        "n": 15,
        "speaker": "BRAVO",
        "scene": "05",
        "paren": "",
        "text": "Tonight mission: wash a fruit. Eat it. Drink water. Save candy for sometimes. Widgeteers Explains, mystery solved.",
        "elevenlabs_text": (
            "[sincere] Tonight mission: [pause] wash a fruit. Eat it. Drink water. "
            "Save candy for sometimes. [proud][smiles] Widgeteers Explains... mystery solved."
        ),
        "pause_after": 0.25,
    },
]


def load_env() -> None:
    try:
        from dotenv import load_dotenv

        load_dotenv(ROOT / ".env", override=True)
    except ImportError:
        env_path = ROOT / ".env"
        if env_path.exists():
            for raw in env_path.read_text(encoding="utf-8").splitlines():
                line = raw.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def load_voice_config() -> dict:
    cfg = dict(DEFAULT_VOICES)
    if VOICES_CFG.exists():
        data = json.loads(VOICES_CFG.read_text(encoding="utf-8"))
        cfg.update({k.upper(): v for k, v in data.items() if not str(k).startswith("_")})
    if os.getenv("ELEVEN_VOICE_BRAVO"):
        cfg["BRAVO"] = os.environ["ELEVEN_VOICE_BRAVO"]
    if os.getenv("ELEVEN_VOICE_PIPI"):
        cfg["PIPI"] = os.environ["ELEVEN_VOICE_PIPI"]
    return cfg


def resolve_voice_ids(client, cfg: dict) -> dict[str, str]:
    voices = client.voices.get_all().voices
    by_name = {v.name.strip().lower(): v.voice_id for v in voices}
    resolved: dict[str, str] = {}
    fallbacks = {
        "PIPI": ["pipi", "aritifical intelligence", "artificial intelligence"],
        "BRAVO": ["bravo american en", "bravo"],
    }
    for role, value in cfg.items():
        if role.startswith("_"):
            continue
        val = str(value).strip()
        if re.fullmatch(r"[a-zA-Z0-9]{10,}", val) and val.lower() not in by_name:
            resolved[role] = val
            continue
        vid = by_name.get(val.lower())
        if not vid:
            for name, id_ in by_name.items():
                if val.lower() in name or name in val.lower():
                    vid = id_
                    break
        if not vid:
            for candidate in fallbacks.get(role, []):
                if candidate in by_name:
                    vid = by_name[candidate]
                    break
        if not vid:
            raise SystemExit(f"Nie znalazlem glosu '{val}' dla {role}.")
        resolved[role] = vid
        print(f"  {role}: '{val}' -> {vid}")
    return resolved


def make_silence_mp3(seconds: float, path: Path) -> bytes:
    import shutil
    import subprocess

    ms = int(round(seconds * 1000))
    path = path.with_name(f"silence_{ms}ms.mp3")
    if path.exists() and path.stat().st_size > 0:
        return path.read_bytes()
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is required")
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=channel_layout=mono:sample_rate=44100",
            "-t",
            f"{seconds:.3f}",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "128k",
            str(path),
        ],
        check=True,
        capture_output=True,
    )
    return path.read_bytes()


def generate_mp3(client, lines: list[dict], voice_ids: dict[str, str]) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TURNS.mkdir(exist_ok=True)
    for leftover in TURNS.glob("line_*.mp3"):
        leftover.unlink()
    audio_parts: list[bytes] = []
    for line in lines:
        n = line["n"]
        text = line["elevenlabs_text"]
        voice_id = voice_ids[line["speaker"]]
        print(f"  [{n:02d}] {line['speaker']}: {text[:72]}...")
        stream = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_v3",
            output_format="mp3_44100_128",
            voice_settings={
                "stability": 0.32,
                "similarity_boost": 0.75,
                "style": 0.72,
                "use_speaker_boost": True,
            },
        )
        part = b"".join(stream)
        (TURNS / f"line_{n:02d}_{line['speaker'].lower()}.mp3").write_bytes(part)
        audio_parts.append(part)
        gap = float(line.get("pause_after", 0.3))
        if gap > 0 and n < len(lines):
            audio_parts.append(make_silence_mp3(gap, OUT_DIR / "silence_cache.mp3"))
    MP3_OUT.write_bytes(b"".join(audio_parts))
    print(f"DONE -> {MP3_OUT}")
    return MP3_OUT


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--generate", action="store_true")
    args = parser.parse_args()
    load_env()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DIALOGUE_JSON.write_text(json.dumps(LINES, indent=2, ensure_ascii=False), encoding="utf-8")
    chunks = ["WIDGETEERS EXPLAINS - Everyday Food and Sometimes Food", ""]
    for line in LINES:
        label = "Bravo American EN" if line["speaker"] == "BRAVO" else "Pipi"
        chunks.append(f"[{label}]")
        chunks.append(line["elevenlabs_text"])
        chunks.append("")
    DIALOGUE_TXT.write_text("\n".join(chunks), encoding="utf-8")
    print(f"Wrote {DIALOGUE_JSON}")
    for line in LINES:
        print(f"{line['n']:02d} {line['speaker']:5} | {line['elevenlabs_text']}")

    if args.dry_run and not args.generate:
        return 0

    api_key = os.getenv("ELEVENLABS_API_KEY") or os.getenv("ELEVEN_API_KEY")
    if not api_key or not api_key.startswith("sk_"):
        print("Brak ELEVENLABS_API_KEY w .env")
        return 1

    from elevenlabs.client import ElevenLabs

    client = ElevenLabs(api_key=api_key)
    cfg = load_voice_config()
    print("Resolving voices...")
    voice_ids = resolve_voice_ids(client, cfg)
    generate_mp3(client, LINES, voice_ids)
    return 0


if __name__ == "__main__":
    sys.exit(main())
