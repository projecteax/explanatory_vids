#!/usr/bin/env python3
"""Extract moon episode dialogue + generate ElevenLabs multi-speaker MP3.

Usage:
  set ELEVENLABS_API_KEY=sk_...
  python tools/elevenlabs_moon_dialogue.py              # list voices + generate
  python tools/elevenlabs_moon_dialogue.py --list-voices
  python tools/elevenlabs_moon_dialogue.py --dry-run

Voice mapping (override via env or voices.json):
  BRAVO -> "Bravo American EN"   (or ELEVEN_VOICE_BRAVO / voice id)
  PIPI  -> "Artificial Intelligence"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EPISODE = ROOT / "web" / "data" / "moon_episode.json"
OUT_DIR = ROOT / "generated" / "audio"
DIALOGUE_JSON = OUT_DIR / "moon_dialogue.json"
DIALOGUE_TXT = OUT_DIR / "moon_dialogue_elevenlabs.txt"
VOICES_CFG = ROOT / "tools" / "elevenlabs_voices.json"
MP3_OUT = OUT_DIR / "moon_why_moon_changes_shape.mp3"

# Default display names from user's ElevenLabs library
DEFAULT_VOICES = {
    "BRAVO": "Bravo American EN",
    # Library spelling is typo'd as "Aritifical" (missing f). Prefer dedicated Pipi if present.
    "PIPI": "Pipi",
}

# Full performed lines: pauses + emotion tags for Eleven v3
# Pipi = comic relief with laughs; Bravo = warm teacher with breathing room
PERFORMED: dict[int, str] = {
    1: (
        "[worried][beeping nervously] Alert! [short pause] The Moon is broken. "
        "[gasps] Last week: big circle. [pause] Tonight: tiny smile. "
        "[dramatic] Someone... is eating it!"
    ),
    2: (
        "[warm][amused] Nobody is eating the Moon, Pipi. [chuckles] "
        "[pause] But it DOES look like it changes shape. [curious][slowly] "
        "Want to know why?"
    ),
    3: (
        "[excited][giggles] Yes! [laughs] Science snack! [eager] Go go go!"
    ),
    4: (
        "[friendly][clear] First big secret: [pause] the Moon is a ball. "
        "[pause] A giant rocky ball floating in space. [gently] "
        "It does not shrink. [short pause] It does not melt."
    ),
    5: (
        "[playful] Ball confirmed. [pokes] Squishy version is smaller. "
        "[laughs] Hehe. Cute Moon."
    ),
    6: (
        "[excited] Second secret: [pause] the Moon does not make its own light. "
        "[happy] The Sun lights it up. [delighted] Like this!"
    ),
    7: (
        "[amazed] Ooooh! [giggles] One cheek sunny... [whispers playfully] "
        "one cheek sleepy. [laughs]"
    ),
    8: (
        "[warm teacher] We live on Earth. [pause] The Moon travels around us. "
        "[slowly] As it moves... we see different sunny pieces of that ball."
    ),
    9: (
        "[happy][bright] When the sunny side faces us... [pause] "
        "we see a FULL MOON! [excited] A bright circle!"
    ),
    10: (
        "[delighted] Big cookie! [laughs harder] Nom nom! Wait. [serious funny] "
        "Do not eat the Moon cookie."
    ),
    11: (
        "[gentle][soft] When we mostly see the dark side... [pause] almost no cookie. "
        "[clear] That is a NEW MOON. [reassuring] The Moon is still there. [pause] "
        "It is just hiding in the Sun's shadow... from our view."
    ),
    12: (
        "[relieved][sighs happily] Not eaten. [mischievously] Just sneaky. "
        "[giggles] Sneaky Moon."
    ),
    13: (
        "[cheerful] In between, we get shapes with funny names. [pause] "
        "Like a banana. [playful] That is a CRESCENT."
    ),
    14: (
        "[snorts][laughing] Moon banana! [pause] Do not eat. [whispers] "
        "Pipi already tried. [giggles] Fake news."
    ),
    15: (
        "[clear][friendly] Half lit is a HALF MOON. [pause] "
        "And when it is almost full, we call it a GIBBOUS... [chuckles] "
        "which just means bumpy almost-circle."
    ),
    16: (
        "[warm][slowly] The whole show takes about one month. [pause] "
        "Same Moon. [short pause] Same ball. [gentle] "
        "Different sunny slice for our eyes."
    ),
    17: (
        "[proud][robotic cute] Shape change equals view change. [pause] "
        "[laughs] Download complete! [happy beep]"
    ),
    18: (
        "[calm][sincere] So next time you look up and the Moon looks skinny... "
        "[pause] remember: [softly] it did not shrink. [warm] "
        "You are just seeing a different piece of sunlight."
    ),
    19: (
        "[soft][to kids][friendly] Tonight homework: [pause] find the Moon. "
        "[playful] Ask: banana... [giggles] half... or cookie? [laughs]"
    ),
    20: (
        "[confident][warm wrap-up] Great question, Pipi. [chuckles] And a great sky. "
        "[pause][proud] Widgeteers Explains... [smiles] mystery solved."
    ),
}

# Gap after each line before the next speaker (seconds)
PAUSE_AFTER = {
    1: 0.85,
    2: 0.70,
    3: 0.55,
    4: 0.90,
    5: 0.75,
    6: 0.70,
    7: 0.80,
    8: 0.85,
    9: 0.55,
    10: 0.90,
    11: 0.85,
    12: 0.80,
    13: 0.65,
    14: 0.95,
    15: 0.80,
    16: 0.75,
    17: 0.85,
    18: 0.90,
    19: 0.70,
    20: 0.40,
}


def normalize_speaker(name: str) -> str | None:
    n = name.upper().split("(")[0].strip()
    if n.startswith("BRAVO"):
        return "BRAVO"
    if n.startswith("PIPI"):
        return "PIPI"
    return None


def extract_lines(episode: dict) -> list[dict]:
    lines: list[dict] = []
    idx = 0
    for scene in episode["scenes"]:
        cur: dict | None = None
        for block in scene["blocks"]:
            t = block["type"]
            if t == "char":
                sp = normalize_speaker(block["name"])
                if not sp:
                    cur = None
                    continue
                cur = {
                    "speaker": sp,
                    "raw_name": block["name"],
                    "paren": "",
                    "scene": scene["id"],
                    "text": "",
                }
            elif t == "paren" and cur is not None:
                cur["paren"] = block["text"]
            elif t == "dial" and cur is not None:
                idx += 1
                text = (
                    block["text"]
                    .strip()
                    .replace("\u2014", " - ")
                    .replace("\u2013", "-")
                    .replace("\u2019", "'")
                    .replace("\u201c", '"')
                    .replace("\u201d", '"')
                )
                spoken = PERFORMED.get(idx) or text
                lines.append(
                    {
                        "n": idx,
                        "speaker": cur["speaker"],
                        "scene": cur["scene"],
                        "paren": cur["paren"],
                        "text": text,
                        "elevenlabs_text": spoken,
                        "pause_after": PAUSE_AFTER.get(idx, 0.7),
                    }
                )
                cur = None
    return lines


def write_exports(lines: list[dict]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DIALOGUE_JSON.write_text(json.dumps(lines, indent=2, ensure_ascii=False), encoding="utf-8")

    # Paste-friendly for ElevenLabs multi-speaker UI
    chunks = [
        "WIDGETEERS EXPLAINS - Why Does the Moon Change Shape?",
        "ElevenLabs multi-speaker paste helper",
        "Bravo  -> voice: Bravo American EN",
        "Pipi   -> voice: Pipi",
        "Model  -> Eleven v3  |  expressive + pauses",
        "",
        "--- COPY BLOCKS BELOW (one speaker turn each) ---",
        "",
    ]
    for line in lines:
        label = "Bravo American EN" if line["speaker"] == "BRAVO" else "Pipi"
        chunks.append(f"[{label}]")
        chunks.append(line["elevenlabs_text"])
        chunks.append("")
    DIALOGUE_TXT.write_text("\n".join(chunks), encoding="utf-8")
    print(f"Wrote {DIALOGUE_JSON}")
    print(f"Wrote {DIALOGUE_TXT}")


def load_voice_config() -> dict:
    cfg = dict(DEFAULT_VOICES)
    if VOICES_CFG.exists():
        data = json.loads(VOICES_CFG.read_text(encoding="utf-8"))
        cfg.update({k.upper(): v for k, v in data.items()})
    # env overrides: name or id
    if os.getenv("ELEVEN_VOICE_BRAVO"):
        cfg["BRAVO"] = os.environ["ELEVEN_VOICE_BRAVO"]
    if os.getenv("ELEVEN_VOICE_PIPI"):
        cfg["PIPI"] = os.environ["ELEVEN_VOICE_PIPI"]
    return cfg


def resolve_voice_ids(client, cfg: dict) -> dict[str, str]:
    """Map BRAVO/PIPI to voice_id. Config value may already be an id."""
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
                    val = candidate
                    break
        if not vid:
            raise SystemExit(
                f"Nie znalazłem głosu '{val}' dla {role}. "
                f"Uruchom: python tools/elevenlabs_moon_dialogue.py --list-voices"
            )
        resolved[role] = vid
        print(f"  {role}: '{val}' -> {vid}")
    return resolved


def list_voices(client) -> None:
    voices = client.voices.get_all().voices
    print(f"{'NAME':40} ID")
    print("-" * 70)
    for v in sorted(voices, key=lambda x: x.name.lower()):
        mark = ""
        nl = v.name.lower()
        if "bravo" in nl:
            mark = "  <-- Bravo?"
        if "artificial" in nl or "intelligence" in nl or "pipi" in nl:
            mark = "  <-- Pipi?"
        print(f"{v.name[:40]:40} {v.voice_id}{mark}")


def make_silence_mp3(seconds: float, path: Path) -> bytes:
    """Create a short silent MP3 via ffmpeg, cache by duration bucket."""
    ms = int(round(seconds * 1000))
    path = path.with_name(f"silence_{ms}ms.mp3")
    if path.exists() and path.stat().st_size > 0:
        return path.read_bytes()
    import shutil
    import subprocess

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        # Fallback: tiny valid-ish gap by reusing empty - better require ffmpeg
        raise SystemExit("ffmpeg is required for pauses between lines. Install ffmpeg and retry.")
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
    """Generate each line with expressive v3 TTS, then stitch with silence gaps."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    turns_dir = OUT_DIR / "turns"
    turns_dir.mkdir(exist_ok=True)

    total_chars = sum(len(line["elevenlabs_text"]) for line in lines)
    print(f"Dialogue turns: {len(lines)}  chars: {total_chars}")
    print("Mode: per-line TTS + silence gaps (more emotion, slower pacing)")

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
                # Lower stability = more expressive / creative for v3
                "stability": 0.35,
                "similarity_boost": 0.75,
                "style": 0.65,
                "use_speaker_boost": True,
            },
        )
        part = b"".join(stream)
        turn_path = turns_dir / f"line_{n:02d}_{line['speaker'].lower()}.mp3"
        turn_path.write_bytes(part)
        audio_parts.append(part)

        gap = float(line.get("pause_after", 0.7))
        if gap > 0 and n < len(lines):
            audio_parts.append(make_silence_mp3(gap, OUT_DIR / "silence_cache.mp3"))

    MP3_OUT.write_bytes(b"".join(audio_parts))
    print(f"DONE -> {MP3_OUT}")
    return MP3_OUT


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--list-voices", action="store_true")
    parser.add_argument("--dry-run", action="store_true", help="Only export dialogue files")
    parser.add_argument("--generate", action="store_true", help="Call ElevenLabs API")
    args = parser.parse_args()

    # Load project .env if present (so you never paste keys into chat)
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

    episode = json.loads(EPISODE.read_text(encoding="utf-8"))
    lines = extract_lines(episode)
    write_exports(lines)
    print(f"Extracted {len(lines)} spoken lines\n")
    for line in lines:
        print(f"{line['n']:02d} {line['speaker']:5} | {line['elevenlabs_text']}")

    if args.dry_run and not args.list_voices and not args.generate:
        return 0

    api_key = os.getenv("ELEVENLABS_API_KEY") or os.getenv("ELEVEN_API_KEY")
    if not api_key or api_key.startswith("sk_PASTE") or not api_key.startswith("sk_"):
        print(
            "\nBrak poprawnego klucza w pliku .env\n"
            f"1) Otworz: {ROOT / '.env'}\n"
            "2) Wklej:  ELEVENLABS_API_KEY=sk_...\n"
            "   (klucz MUSI zaczynac sie od sk_ — nie od hex ID)\n"
            "3) Zapisz i odpal:  python tools/elevenlabs_moon_dialogue.py --generate\n"
            "   albo:  generate_moon_audio.bat\n"
        )
        return 0 if args.dry_run else 1

    try:
        from elevenlabs.client import ElevenLabs
    except ImportError:
        print("pip install elevenlabs python-dotenv")
        return 1

    client = ElevenLabs(api_key=api_key)
    if args.list_voices:
        list_voices(client)
        return 0

    if args.generate or (not args.dry_run and not args.list_voices):
        cfg = load_voice_config()
        print("Resolving voices...")
        voice_ids = resolve_voice_ids(client, cfg)
        # persist ids for next runs
        VOICES_CFG.write_text(
            json.dumps(
                {
                    "BRAVO": voice_ids["BRAVO"],
                    "PIPI": voice_ids["PIPI"],
                    "_names": DEFAULT_VOICES,
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        generate_mp3(client, lines, voice_ids)
    return 0


if __name__ == "__main__":
    sys.exit(main())
