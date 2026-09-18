#!/usr/bin/env python3
"""Build The Widgeteers Explains: Why Does the Moon Change Shape? — JSON + PDF."""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parents[1]
WEB_JSON = ROOT / "web" / "data" / "moon_episode.json"
PDF_PATH = ROOT / "scripts" / "why_does_the_moon_change_shape_script.pdf"
CATALOG = ROOT / "web" / "data" / "episodes.json"

# Live-action 3D frames (lab)
STYLE_3D = (
    "Still from a Pixar-style 3D animated children's feature film, The Widgeteers, "
    "cinematic camera language, 35mm movie frame, motivated practical teal lab lighting, "
    "subsurface scattering, Unreal Engine 5 / Octane quality. "
    "FILM FRAME not poster. Characters look INTO the scene; backs, profiles, OTS allowed."
)

# Flat 2D graphics ON the lab screen
STYLE_2D = (
    "Clean 2D children's educational animation graphic for a TV screen insert, "
    "bold flat shapes, soft cel shading, limited palette of deep navy, cream yellow, "
    "soft orange and teal. Cute, simple, readable for ages 6–7. "
    "NO photoreal, NO 3D, NO horror, NO tiny unreadable text walls."
)

NEGATIVE_3D = (
    "poster, turnaround, character sheet, T-pose, looking at camera, white background, "
    "watermark, text overlay, logo, collage, photoreal, horror"
)

NEGATIVE_2D = (
    "photoreal, 3D render, horror moon face, scary crater monsters, tiny unreadable paragraphs, "
    "watermark, logo, collage, adult textbook diagram"
)

LOCKS = {
    "bravo_civ": (
        "BRAVO civilian: 10-year-old Pixar boy, round cheeks, huge amber-brown eyes, "
        "thick black rectangular glasses, wild voluminous curly orange-red hair, "
        "white collared shirt, blue argyle knit vest with brown and tan diamonds, "
        "beige cream striped cuffed shorts, blue sneakers with orange stripes."
    ),
    "pipi": (
        "PIPI: tiny spherical white robot drone, rounded helmet head, two ear-like fins, "
        "two small side propellers, dark visor with a glowing teal-cyan LED smiley face, "
        "one skinny white robot arm. Cute, hovering, Pixar."
    ),
    "lab": (
        "Bravo's secret lab: compact high-tech underground garage, grey paneled walls, "
        "teal strip lights, black pipes, yellow-black hazard tape, curved holographic monitor "
        "OR large wall screen, glass-top work table, two cylindrical suit tubes, "
        "orange-white computer kiosk, terrazzo floor."
    ),
}

REFS = {
    "bravo_civ": ["Characters/bravo_civilian.png", "Characters/bravo_school.png"],
    "pipi": ["Characters/pipi.png", "Characters/pipi_close.jpg", "Characters/pipi2.png"],
    "lab": ["Locations/lab01.png", "Locations/lab02.png", "Locations/lab03.png"],
}

CHARACTERS = [
    {
        "id": "bravo",
        "name": "Bravo",
        "role": "Inventor-host",
        "blurb": "Explains the Moon with gadgets, a flashlight, and a ball. Patient, curious, never condescending.",
        "images": REFS["bravo_civ"],
    },
    {
        "id": "pipi",
        "name": "Pipi",
        "role": "Curious sidekick",
        "blurb": "Asks the kid questions out loud. Beeps, points, learns with the audience.",
        "images": REFS["pipi"],
    },
]

LOCATIONS = [
    {
        "id": "lab",
        "name": "Secret lab",
        "images": REFS["lab"],
        "note": "Entire episode. Big wall screen carries the 2D lesson graphics.",
    }
]


def prompt_3d(camera: str, action: str, lock_ids: list[str], ref_ids: list[str]) -> str:
    locks = " ".join(LOCKS[i] for i in lock_ids)
    files: list[str] = []
    for rid in ref_ids:
        files.extend(REFS.get(rid, []))
    uniq = list(dict.fromkeys(files))
    ref_line = (
        "REFERENCE IMAGES: " + ", ".join(uniq)
        if uniq
        else "Follow written locks."
    )
    return (
        f"{STYLE_3D} CAMERA: {camera} WHAT'S ON SCREEN: {action} "
        f"IDENTITY LOCKS: {locks} {ref_line}"
    )


def prompt_2d(title: str, visual: str) -> str:
    return (
        f"{STYLE_2D} TITLE BEAT: {title}. VISUAL: {visual}. "
        "Designed to look like a bright cartoon playing ON a curved lab monitor / wall screen."
    )


def shot(
    sid: str,
    scene: str,
    tc: str,
    dur: int,
    size: str,
    title: str,
    kind: str,
    camera: str,
    action: str,
    lock_ids: list[str] | None = None,
    ref_ids: list[str] | None = None,
    dialogue: str = "",
    screen_2d: str = "",
) -> dict:
    mm, ss = tc.split(":")
    start = int(mm) * 60 + int(ss)
    end = start + dur
    tc_in = f"00:{start // 60:02d}:{start % 60:02d}"
    tc_out = f"00:{end // 60:02d}:{end % 60:02d}"
    lock_ids = lock_ids or []
    ref_ids = ref_ids or []
    if kind == "2d":
        p = prompt_2d(title, action)
        neg = NEGATIVE_2D
        refs: list[str] = []
    else:
        p = prompt_3d(camera, action, lock_ids, ref_ids)
        neg = NEGATIVE_3D
        refs = list(dict.fromkeys(sum((REFS.get(r, []) for r in ref_ids), [])))
    return {
        "id": sid,
        "scene": scene,
        "tc": tc,
        "tc_in": tc_in,
        "tc_out": tc_out,
        "dur": dur,
        "size": size,
        "title": title,
        "kind": kind,
        "camera": camera,
        "action": action,
        "dialogue": dialogue,
        "screen_2d": screen_2d,
        "lock_ids": lock_ids,
        "ref_ids": ref_ids,
        "refs": refs,
        "prompt": p,
        "negative": neg,
    }


SCENES = [
    {
        "id": "01",
        "act": "I",
        "tc": "0:00–0:25",
        "heading": "SCENE 01  INT. BRAVO'S SECRET LAB - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "The secret lab glows teal. On the big curved WALL SCREEN: a cute flat drawing of a full Moon. "
                    "BRAVO (civilian) sits at the work table with a flashlight and a white foam ball. "
                    "PIPI hovers beside him, staring at the screen."
                ),
            },
            {"type": "char", "name": "PIPI"},
            {"type": "paren", "text": "(worried beep)"},
            {
                "type": "dial",
                "text": "Alert. The Moon is broken. Last week: big circle. Tonight: tiny smile. Someone is eating it.",
            },
            {"type": "char", "name": "BRAVO"},
            {"type": "paren", "text": "(grinning, gentle)"},
            {
                "type": "dial",
                "text": "Nobody is eating the Moon, Pipi. But it DOES look like it changes shape. Want to know why?",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Yes. Science snack. Go."},
            {
                "type": "action",
                "text": (
                    "Bravo taps the console. Title card blooms on the wall screen in soft 2D: "
                    "WHY DOES THE MOON CHANGE SHAPE?"
                ),
            },
        ],
    },
    {
        "id": "02",
        "act": "I",
        "tc": "0:25–0:55",
        "heading": "SCENE 02  INT. LAB / DEMO TABLE - CONTINUOUS",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Bravo holds up the white ball. Pipi clicks on a tiny desk lamp / flashlight. "
                    "On the WALL SCREEN, a matching 2D cartoon ball and sun-lamp appear."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "First big secret: the Moon is a ball. A giant rocky ball floating in space. It does not shrink. It does not melt.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "paren", "text": "(poking the foam ball)"},
            {"type": "dial", "text": "Ball confirmed. Squishy version is smaller."},
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "Second secret: the Moon does not make its own light. The Sun lights it up. Like this.",
            },
            {
                "type": "action",
                "text": (
                    "He shines the flashlight on one side of the ball. Half bright, half dark. "
                    "The screen mirrors it in clean 2D: yellow sun rays hitting a grey moon-ball."
                ),
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Ooooh. One cheek sunny. One cheek sleepy."},
        ],
    },
    {
        "id": "03",
        "act": "II",
        "tc": "0:55–1:35",
        "heading": "SCENE 03  INT. LAB / WALL SCREEN - CONTINUOUS",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Bravo walks the ball in a slow circle around a little stand labeled EARTH (or Pipi herself as Earth). "
                    "Camera favors the WALL SCREEN as the lesson takes over in 2D."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "We live on Earth. The Moon travels around us. As it moves, we see different sunny pieces of that ball.",
            },
            {
                "type": "action",
                "text": (
                    "ON SCREEN (2D): Earth in the middle. Sun fixed on the left. Moon slides around Earth. "
                    "A little eye-icon shows what Earth kids see each time."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "When the sunny side faces us — we see a FULL MOON. A bright circle.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Big cookie."},
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "When we mostly see the dark side — almost no cookie. That is a NEW MOON. The Moon is still there. It is just hiding in the Sun's shadow from our view.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "paren", "text": "(relieved)"},
            {"type": "dial", "text": "Not eaten. Just sneaky."},
        ],
    },
    {
        "id": "04",
        "act": "II",
        "tc": "1:35–2:20",
        "heading": "SCENE 04  INT. LAB / PHASE PARADE ON SCREEN - CONTINUOUS",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "The wall screen becomes a cheerful PHASE PARADE — five big moon shapes slide left to right. "
                    "Bravo points with a laser pointer; Pipi zooms along the row."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "In between, we get shapes with funny names. Like a banana. That is a CRESCENT.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Moon banana. Do not eat."},
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "Half lit is a HALF MOON. And when it is almost full, we call it a GIBBOUS — which just means 'bumpy almost-circle.'",
            },
            {
                "type": "action",
                "text": (
                    "ON SCREEN (2D): New → Crescent → Half → Gibbous → Full, then reverse. "
                    "A tiny calendar note: about one month for a full trip."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "The whole show takes about one month. Same Moon. Same ball. Different sunny slice for our eyes.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Shape change equals view change. Download complete."},
        ],
    },
    {
        "id": "05",
        "act": "III",
        "tc": "2:20–3:00",
        "heading": "SCENE 05  INT. LAB - CONTINUOUS",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Bravo kills the flashlight. The foam ball sits in soft lab light — always a full sphere. "
                    "The screen shows a quiet night sky with a crescent and a tiny label: STILL A BALL."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "So next time you look up and the Moon looks skinny, remember: it did not shrink. You are just seeing a different piece of sunlight.",
            },
            {"type": "char", "name": "PIPI"},
            {"type": "paren", "text": "(to camera / kids, soft)"},
            {
                "type": "dial",
                "text": "Tonight homework: find the Moon. Ask: banana, half, or cookie?",
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "Great question, Pipi. And a great sky. Widgeteers Explains — mystery solved.",
            },
            {
                "type": "action",
                "text": (
                    "Pipi draws a tiny teal heart on the screen over the Moon. "
                    "Bravo clicks off the title. Soft fade."
                ),
            },
            {"type": "action", "text": "THE END"},
        ],
    },
]


SHOTS = [
    # LIVE LAB
    shot(
        "M01", "01", "0:00", 5, "WS", "Lab open + Moon on screen", "3d",
        "Wide from the lab stairs / doorway. Bravo at the table in three-quarter, Pipi hovering, wall screen showing a flat Full Moon graphic. Not a poster lineup.",
        "Secret lab at night, Bravo civilian and Pipi looking toward the big screen, Full Moon 2D art glowing on the monitor.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='PIPI: "The Moon is broken."',
    ),
    shot(
        "M02", "01", "0:05", 6, "OTS", "Pipi worried about the Moon", "3d",
        "Over Bravo's shoulder toward Pipi and the screen. Pipi in profile pointing at the Moon graphic. Screen soft in focus.",
        "Pipi pointing at wall-screen Moon; Bravo listening from foreground as soft focus shoulder.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='PIPI: "Last week: big circle. Tonight: tiny smile."',
    ),
    shot(
        "M03", "01", "0:11", 7, "MCU", "Bravo invites the lesson", "3d",
        "Three-quarter close of Bravo civilian at the console, looking at Pipi / screen, not at lens. Warm inventor energy.",
        "Bravo smiling gently, glasses catching teal light, hand near console.",
        ["bravo_civ", "lab"], ["bravo_civ", "lab"],
        dialogue='BRAVO: "Nobody is eating the Moon. Want to know why it changes shape?"',
    ),
    # 2D TITLE
    shot(
        "M04", "01", "0:18", 7, "GFX", "Title card on screen", "2d",
        "Full-bleed graphic as if photographed off the lab monitor (subtle scanline optional).",
        "Big soft title WHY DOES THE MOON CHANGE SHAPE? over a navy night sky, cute cream Full Moon, tiny teal drone silhouette of Pipi in the corner. Simple, bold, kid-friendly.",
        dialogue="(title)",
        screen_2d="Title card",
    ),
    # DEMO
    shot(
        "M05", "02", "0:25", 8, "MS", "Ball = Moon", "3d",
        "Side angle at the work table. Bravo holds a white foam ball; Pipi in profile inspects it. Screen behind shows matching 2D ball.",
        "Bravo presenting foam ball as Moon model, Pipi poking it, lab practicals.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='BRAVO: "The Moon is a ball. It does not shrink."',
    ),
    shot(
        "M06", "02", "0:33", 8, "CU", "Flashlight lights one cheek", "3d",
        "Close insert: flashlight beam hitting one side of the foam ball; Bravo's fingers and Pipi's tiny arm in soft edge. Half bright / half dark.",
        "Foam ball half-lit by flashlight, cinematic insert, lab bokeh.",
        ["bravo_civ", "pipi"], ["bravo_civ", "pipi"],
        dialogue='BRAVO: "The Moon does not make its own light. The Sun lights it up."',
    ),
    shot(
        "M07", "02", "0:41", 7, "GFX", "2D sun rays on moon-ball", "2d",
        "Clean educational graphic filling the frame.",
        "Flat 2D: bright yellow Sun on the left casting simple rays onto a grey cratered moon-ball; left half lit cream-yellow, right half soft navy shadow. Label dots optional: SUN / MOON. No paragraphs.",
        dialogue='PIPI: "One cheek sunny. One cheek sleepy."',
        screen_2d="Sun lights Moon",
    ),
    # ORBIT LESSON
    shot(
        "M08", "03", "0:48", 8, "OTS", "Bravo starts the orbit demo", "3d",
        "Over Pipi's tiny body toward Bravo walking the foam ball around a stand / Pipi-as-Earth. Screen beginning orbit animation.",
        "Bravo moving Moon-ball in a circle; Pipi watching; wall screen echoing the motion in 2D.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='BRAVO: "The Moon travels around Earth. We see different sunny pieces."',
    ),
    shot(
        "M09", "03", "0:56", 12, "GFX", "2D orbit + eye view", "2d",
        "Full educational board.",
        "Flat 2D diagram: Earth center, fixed Sun left, Moon at several positions on a dashed orbit. At each Moon position a small eye-icon shows the shape Earth sees (new, crescent, half, gibbous, full). Soft icons, big shapes, almost no text.",
        dialogue='BRAVO: "When the sunny side faces us — FULL MOON."',
        screen_2d="Orbit diagram",
    ),
    shot(
        "M10", "03", "1:08", 8, "MCU", "Full cookie / New sneaky", "3d",
        "Two-beat feel in one frame or slight pan: Bravo pointing at screen Full Moon, Pipi relieved. Three-quarter, looking at screen.",
        "Bravo and Pipi reacting to Full vs New Moon on the monitor.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='PIPI: "Not eaten. Just sneaky."',
    ),
    shot(
        "M11", "03", "1:16", 10, "GFX", "Full vs New compare", "2d",
        "Split graphic, still one board not collage chaos.",
        "Two big panels: LEFT cream Full Moon labeled FULL (cookie). RIGHT nearly invisible dark Moon with faint outline labeled NEW (sneaky). Friendly, not scary.",
        dialogue='BRAVO: "New Moon — the Moon is still there."',
        screen_2d="Full vs New",
    ),
    # PHASE PARADE
    shot(
        "M12", "04", "1:26", 10, "GFX", "Phase parade", "2d",
        "Wide graphic strip.",
        "Five giant moon phases in a row on navy: New (outline), Crescent banana, Half, Gibbous, Full. Soft bounce-ready shapes. Tiny icons: banana, cookie. Extremely readable for 6-year-olds.",
        dialogue='BRAVO: "Crescent is like a banana. Half moon. Gibbous is almost full."',
        screen_2d="Phase parade",
    ),
    shot(
        "M13", "04", "1:36", 8, "MS", "Pipi zooms the row", "3d",
        "Tracking with Pipi as she flies along the wall screen phase parade; Bravo points with a small laser. We see their profiles and the glowing graphics.",
        "Pipi flying beside phase graphics; Bravo pointing; lab teal reflections on screen glass.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='PIPI: "Moon banana. Do not eat."',
    ),
    shot(
        "M14", "04", "1:44", 10, "GFX", "One-month loop", "2d",
        "Simple motion-friendly loop board.",
        "Circular arrow around Earth+Moon icons with a cute calendar square marked '~1 MONTH'. Phases tick around the circle. Soft teal accents.",
        dialogue='BRAVO: "The whole show takes about one month."',
        screen_2d="Month loop",
    ),
    shot(
        "M15", "04", "1:54", 8, "MCU", "Pipi download complete", "3d",
        "Close three-quarter of Pipi visor smiley + Bravo nodding beyond her, both looking at screen.",
        "Pipi proud beep face; Bravo affirming the lesson.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='PIPI: "Shape change equals view change. Download complete."',
    ),
    # OUTRO
    shot(
        "M16", "05", "2:02", 10, "MS", "Ball still a ball", "3d",
        "Quiet medium: flashlight off, foam ball fully visible as a sphere on the table. Screen shows crescent + STILL A BALL. Bravo and Pipi in soft profile.",
        "Calm coda in the lab; model Moon on table; crescent on screen.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='BRAVO: "It did not shrink. You are seeing a different piece of sunlight."',
    ),
    shot(
        "M17", "05", "2:12", 10, "GFX", "Homework sky", "2d",
        "Friendly night sky card.",
        "Cute night sky with one crescent Moon. Three big choice buttons/icons: banana / half / cookie. Soft text: TONIGHT — WHICH MOON? Kid game energy, not exam.",
        dialogue='PIPI: "Find the Moon. Ask: banana, half, or cookie?"',
        screen_2d="Homework prompt",
    ),
    shot(
        "M18", "05", "2:22", 8, "WS", "Sign-off", "3d",
        "Wide lab beauty shot. Bravo waves lightly toward Pipi (not camera). Pipi draws a teal heart over the Moon on screen. Lights dim a touch.",
        "Widgeteers Explains sign-off in the secret lab, warm and small.",
        ["bravo_civ", "pipi", "lab"], ["bravo_civ", "pipi", "lab"],
        dialogue='BRAVO: "Widgeteers Explains — mystery solved."',
    ),
    shot(
        "M19", "05", "2:30", 10, "GFX", "End card", "2d",
        "Simple end card.",
        "Navy end card: THE END + small Full Moon + tiny Pipi heart. Optional line: Widgeteers Explains. Clean, soft, no clutter.",
        dialogue="THE END",
        screen_2d="End card",
    ),
]


# Trim last shot timing so total ~180s if needed — current sum:
# We'll set runtime to 2:40 based on shot durs
RUNTIME_SEC = sum(s["dur"] for s in SHOTS)

EPISODE = {
    "series": "The Widgeteers Explains",
    "title": "Why Does the Moon Change Shape?",
    "code": "EX01",
    "format": "lab_explainer",
    "runtime": f"{RUNTIME_SEC // 60}:{RUNTIME_SEC % 60:02d}",
    "runtime_seconds": RUNTIME_SEC,
    "logline": (
        "Pipi thinks someone is eating the Moon. Bravo proves it is still a ball — "
        "we just see different slices of sunlight as it orbits Earth."
    ),
    "moral": "The Moon does not shrink. Its shape changes because of sunlight and our point of view.",
    "tone": "Gentle STEM explainer for ages 6–7. Lab host + 2D screen graphics. Only Bravo and Pipi.",
    "age": "6–7",
    "cast": ["Bravo (civilian)", "Pipi"],
    "style_lock_3d": STYLE_3D,
    "style_lock_2d": STYLE_2D,
    "negative": NEGATIVE_3D,
    "negative_2d": NEGATIVE_2D,
    "characters": CHARACTERS,
    "locations": LOCATIONS,
    "scenes": SCENES,
    "shots": SHOTS,
    "acts": [
        {"id": "I", "name": "The Question", "tc": "0:00–0:55"},
        {"id": "II", "name": "The Orbit Lesson", "tc": "0:55–2:20"},
        {"id": "III", "name": "Remember & Look Up", "tc": "2:20–end"},
    ],
    "pdf": "scripts/why_does_the_moon_change_shape_script.pdf",
}


def register_fonts() -> str:
    cour = Path(r"C:\Windows\Fonts\cour.ttf")
    courbd = Path(r"C:\Windows\Fonts\courbd.ttf")
    if cour.exists():
        pdfmetrics.registerFont(TTFont("WGCourier", str(cour)))
        pdfmetrics.registerFont(TTFont("WGCourier-Bold", str(courbd if courbd.exists() else cour)))
        return "WGCourier"
    return "Courier"


def write_json() -> None:
    WEB_JSON.parent.mkdir(parents=True, exist_ok=True)
    WEB_JSON.write_text(json.dumps(EPISODE, indent=2, ensure_ascii=False), encoding="utf-8")
    catalog = [
        {
            "id": "ghost",
            "title": "The Ghost of Glow-A-Lot",
            "code": "EP05",
            "file": "data/episode.json",
            "kind": "adventure",
        },
        {
            "id": "moon",
            "title": "Why Does the Moon Change Shape?",
            "code": "EX01",
            "file": "data/moon_episode.json",
            "kind": "explainer",
        },
    ]
    CATALOG.write_text(json.dumps(catalog, indent=2), encoding="utf-8")


def write_pdf() -> None:
    font = register_fonts()
    bold = f"{font}-Bold" if font == "WGCourier" else "Courier-Bold"
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)

    title_style = ParagraphStyle(
        "TitlePage", fontName=bold, fontSize=20, leading=26, alignment=TA_CENTER, spaceAfter=12
    )
    sub_style = ParagraphStyle(
        "Sub", fontName=font, fontSize=11, leading=16, alignment=TA_CENTER, spaceAfter=6
    )
    heading = ParagraphStyle(
        "Head", fontName=bold, fontSize=12, leading=16, alignment=TA_LEFT, spaceBefore=14, spaceAfter=8
    )
    action = ParagraphStyle(
        "Action", fontName=font, fontSize=12, leading=16, alignment=TA_LEFT, spaceAfter=8
    )
    char_s = ParagraphStyle(
        "Char", fontName=bold, fontSize=12, leading=16, alignment=TA_CENTER, spaceBefore=8, spaceAfter=2
    )
    paren_s = ParagraphStyle(
        "Paren", fontName=font, fontSize=11, leading=14, alignment=TA_CENTER, leftIndent=90, rightIndent=90
    )
    dial_s = ParagraphStyle(
        "Dial",
        fontName=font,
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        leftIndent=72,
        rightIndent=72,
        spaceAfter=6,
    )
    end_s = ParagraphStyle(
        "End", fontName=bold, fontSize=12, leading=16, alignment=TA_CENTER, spaceBefore=24
    )

    story = []
    story.append(Spacer(1, 2.8 * inch))
    story.append(Paragraph("THE WIDGETEERS EXPLAINS", sub_style))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("WHY DOES THE MOON<br/>CHANGE SHAPE?", title_style))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(f"Episode EX01  •  Runtime ~{EPISODE['runtime']}", sub_style))
    story.append(Paragraph("Ages 6–7  •  Cast: Bravo &amp; Pipi  •  Lab + 2D screen", sub_style))
    story.append(PageBreak())

    story.append(Paragraph('THE WIDGETEERS EXPLAINS  —  "Why Does the Moon Change Shape?"', action))
    story.append(Paragraph(f"Runtime: ~{EPISODE['runtime']} &nbsp;&nbsp; Format: Lab explainer", action))
    story.append(Paragraph(f"<i>Logline. {EPISODE['logline']}</i>", action))
    story.append(
        Paragraph(
            "<i>Key idea. The Moon is always a ball. Sunlight lights one side. "
            "As the Moon orbits Earth, we see different sunny slices — so the shape seems to change.</i>",
            action,
        )
    )

    for scene in SCENES:
        story.append(Paragraph(scene["heading"] + f"  ({scene['tc']})", heading))
        for block in scene["blocks"]:
            t = block["type"]
            if t == "action":
                if block["text"] == "THE END":
                    story.append(Paragraph("THE END", end_s))
                else:
                    story.append(Paragraph(block["text"], action))
            elif t == "char":
                story.append(Paragraph(block["name"], char_s))
            elif t == "paren":
                story.append(Paragraph(block["text"], paren_s))
            elif t == "dial":
                story.append(Paragraph(block["text"], dial_s))

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont(font, 9)
        canvas.drawCentredString(letter[0] / 2, 0.55 * inch, str(doc.page))
        if doc.page > 1:
            canvas.drawString(0.85 * inch, 0.55 * inch, "WHY DOES THE MOON CHANGE SHAPE?")
            canvas.drawRightString(letter[0] - 0.85 * inch, 0.55 * inch, "WIDGETEERS EXPLAINS")
        canvas.restoreState()

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        leftMargin=1.1 * inch,
        rightMargin=1.1 * inch,
        topMargin=1.0 * inch,
        bottomMargin=0.9 * inch,
        title="Why Does the Moon Change Shape?",
        author="The Widgeteers Explains",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    write_json()
    write_pdf()
    print(f"JSON {WEB_JSON}")
    print(f"PDF  {PDF_PATH}")
    print(f"runtime {EPISODE['runtime']}  scenes {len(SCENES)}  shots {len(SHOTS)}")
    n2d = sum(1 for s in SHOTS if s["kind"] == "2d")
    print(f"3D beats {len(SHOTS) - n2d}  |  2D screen beats {n2d}")
