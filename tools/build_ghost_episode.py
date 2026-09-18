#!/usr/bin/env python3
"""Build The Widgeteers: The Ghost of Glow-A-Lot — JSON + screenplay PDF."""

from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[1]
WEB_JSON = ROOT / "web" / "data" / "episode.json"
PDF_PATH = ROOT / "scripts" / "the_ghost_of_glowalot_script.pdf"

STYLE_LOCK = (
    "Still from a Pixar-style 3D animated children's feature film, The Widgeteers, "
    "cinematic live-action camera language, 35mm anamorphic movie frame, "
    "motivated practical lighting, volumetric fog, subsurface scattering on skin, "
    "rich autumn night carnival colors, shallow depth of field, Unreal Engine 5 / Octane quality. "
    "CRITICAL: this is a FILM FRAME, not a character poster, not a toy catalog, "
    "not a turnaround sheet, not a centered hero pose facing the camera. "
    "Characters look INTO the scene. Backs, napes, profiles, over-the-shoulder, "
    "three-quarter rear views, and foreground occlusion are correct and desired. "
    "Do not rotate anyone to face the lens just to look pretty."
)

NEGATIVE = (
    "poster, movie poster, character sheet, turnaround, model sheet, toy commercial, "
    "catalog pose, T-pose, A-pose, square to camera, looking at viewer, eye contact with camera, "
    "centered hero stance, white background, studio cyclorama, beauty-pack shot, "
    "symmetrical product lighting, watermark, text overlay, logo, split screen, collage, "
    "photoreal humans, horror gore, scary uncanny ghost, ugly distortion"
)

LOCKS = {
    "bravo_civ": (
        "BRAVO civilian: 10-year-old Pixar boy, round cheeks, huge amber-brown eyes, "
        "thick black rectangular glasses, wild voluminous curly orange-red hair, "
        "white collared shirt, blue argyle knit vest with brown and tan diamonds, "
        "beige cream striped cuffed shorts, blue sneakers with orange stripes."
    ),
    "bravo_hero": (
        "BRAVO hero suit: compact 10-year-old in a teal-blue superhero bodysuit with glowing cyan "
        "circuit lines, big cyan 'W' on the chest, glossy green helmet with a dorsal fin and ear wings, "
        "blue eye-mask, green shoulder pads, belt buckle letter 'B', dark boots."
    ),
    "tango_civ": (
        "TANGO civilian: 10-year-old Black Pixar boy, big brown eyes, light freckles, warm grin, "
        "white-and-brown trucker cap with a gold lightning-bolt logo, grey hoodie, blue pants, "
        "purple sneakers with light-blue straps, often holding an orange basketball."
    ),
    "tango_hero": (
        "TANGO hero suit: compact 10-year-old in a purple-gold superhero bodysuit, gold 'W' on the chest, "
        "glossy bronze-gold helmet with fins, purple eye-mask, gold shoulder pads and bracers, "
        "belt buckle letter 'T', dark purple boots."
    ),
    "pipi": (
        "PIPI: tiny spherical white robot drone, rounded helmet head, two ear-like fins, "
        "two small side propellers, dark visor with a glowing teal-cyan LED smiley face, "
        "one skinny white robot arm. Cute, hovering, Pixar."
    ),
    "muffin": (
        "MUFFIN: chubby round Pixar burglar, very round pink face, small brown eyes close together, "
        "black eye-mask, tight black knit beanie, dark grey pinstripe shirt, black vest, short round body. "
        "Bumbling, hungry, lovable idiot. Not scary."
    ),
    "churro": (
        "CHURRO: tall skinny Pixar burglar, long narrow face, pencil mustache, black eye-mask, "
        "dark brown-black fedora with a wide brim, long black overcoat, white collared shirt, "
        "long thin legs, brown shoes. Thinks he is a genius."
    ),
    "hoot": (
        "HOOT: a tiny fluffy white barn owl, oversized golden cartoon eyes, small peach beak, "
        "soft round body. Tangled in a too-big white magician's cape that reads as a baby ghost sheet, "
        "with two poked eye-holes. Cute, shy, never horror."
    ),
    "pumpkin": (
        "KINDNESS PUMPKIN: giant cartoon pumpkin piggy-bank, warm orange, friendly carved smile, "
        "gold coin-slot on top, string lights, wooden pedestal, banner reading "
        "'KINDNESS PUMPKIN — COINS FOR THE PETTING ZOO!'."
    ),
    "carnival": (
        "Glow-A-Lot Carnival at night: cozy autumn amusement park, gold-purple Ferris wheel, "
        "bumper cars, popcorn cart, cotton-candy stall, calliope, fairy lights, painted booths, "
        "fallen leaves, gentle fog. Kid-safe, colorful, Pixar, not a haunted house from a horror movie."
    ),
    "lab": (
        "Bravo's secret lab: compact high-tech underground garage, grey paneled walls, teal strip lights, "
        "black pipes, yellow-black hazard tape, curved holographic monitor, glass-top work table, "
        "two cylindrical suit tubes holding purple-gold and teal-green hero suits, orange-white computer kiosk, "
        "terrazzo floor."
    ),
    "tango_room": (
        "Tango's bedroom at night: blue wallpaper printed with white gears, two windows with blinds, "
        "round wall clock, wooden desk and chair, Captain Spark posters, rumpled bed with colorful quilt, "
        "orange basketball, skateboard, brown beanbag, rainbow checkered rug, warm lamp light."
    ),
}

REFS = {
    "bravo_civ": ["Characters/bravo_civilian.png", "Characters/bravo_school.png"],
    "bravo_hero": [
        "Characters/bravo_hero.png",
        "Characters/close_up_bravo_hero.png",
        "Characters/bravo_powerpose.png",
    ],
    "tango_civ": ["Characters/tango_civilian.png"],
    "tango_hero": ["Characters/tango_hero.png", "Characters/tango_power_pose.png"],
    "pipi": ["Characters/pipi.png", "Characters/pipi_close.jpg", "Characters/pipi2.png"],
    "muffin": [
        "Characters/muffin_profile.jpg",
        "Characters/muffin_2.jpg",
        "Characters/muffin_churro.png",
    ],
    "churro": [
        "Characters/churro_profile.jpg",
        "Characters/churro_2.jpg",
        "Characters/muffin_churro.png",
    ],
    "duo": ["Characters/muffin_churro.png"],
    "lab": ["Locations/lab01.png", "Locations/lab02.png", "Locations/lab03.png"],
    "tango_room": ["Locations/tango_badroom.png"],
    "scooter": ["vehicles/scooter_front.jpg"],
    "jetbike": ["vehicles/jetbike_front.jpg"],
}

CHARACTERS = [
    {
        "id": "bravo",
        "name": "Bravo",
        "role": "Widgeteer — brains",
        "blurb": "Ten-year-old inventor. Ghosts are 'unverified'. Gadgets first, panic never (almost).",
        "images": REFS["bravo_civ"] + REFS["bravo_hero"],
    },
    {
        "id": "tango",
        "name": "Tango",
        "role": "Widgeteer — guts",
        "blurb": "Ten-year-old athlete. Jumps first, screams second, high-fives third.",
        "images": REFS["tango_civ"] + REFS["tango_hero"],
    },
    {
        "id": "pipi",
        "name": "Pipi",
        "role": "Tiny drone pal",
        "blurb": "Hovering lab buddy. Scans, beeps, and the occasional perfectly timed BOO.",
        "images": REFS["pipi"],
    },
    {
        "id": "muffin",
        "name": "Muffin",
        "role": "Bumbling burglar",
        "blurb": "Round, hungry, and convinced every plan is a snack plan.",
        "images": REFS["muffin"],
    },
    {
        "id": "churro",
        "name": "Churro",
        "role": "Skinny 'mastermind'",
        "blurb": "Mustache, fedora, terrible ideas with excellent branding.",
        "images": REFS["churro"],
    },
    {
        "id": "hoot",
        "name": "Hoot",
        "role": "The 'ghost'",
        "blurb": "Shy carnival owl who nested in the Kindness Pumpkin. Cape optional, nap mandatory.",
        "images": [],
    },
]

LOCATIONS = [
    {
        "id": "tango_room",
        "name": "Tango's bedroom",
        "images": REFS["tango_room"],
        "note": "Act I call-to-adventure. Keep gear wallpaper, posters, basketball clutter.",
    },
    {
        "id": "lab",
        "name": "Secret lab",
        "images": REFS["lab"],
        "note": "Suit-up and briefing. Teal practicals, suit tubes, Pipi's domain.",
    },
    {
        "id": "carnival",
        "name": "Glow-A-Lot Carnival",
        "images": [],
        "note": "No plate yet — invent a cozy Pixar autumn carnival, never horror-park.",
    },
]


def prompt_for(camera: str, action: str, lock_ids: list[str], ref_ids: list[str]) -> str:
    locks = " ".join(LOCKS[i] for i in lock_ids)
    files: list[str] = []
    for rid in ref_ids:
        files.extend(REFS.get(rid, []))
    # unique, stable order
    seen: set[str] = set()
    uniq = []
    for f in files:
        if f not in seen:
            seen.add(f)
            uniq.append(f)
    ref_line = (
        "REFERENCE IMAGES (match identity, costume, proportions exactly): " + ", ".join(uniq)
        if uniq
        else "No photo plate for this subject — follow the written lock."
    )
    return (
        f"{STYLE_LOCK} CAMERA: {camera} WHAT'S ON SCREEN: {action} "
        f"IDENTITY LOCKS: {locks} {ref_line}"
    )


def shot(
    sid: str,
    scene: str,
    tc: str,
    dur: int,
    size: str,
    title: str,
    camera: str,
    action: str,
    lock_ids: list[str],
    ref_ids: list[str],
    dialogue: str = "",
) -> dict:
    mm, ss = tc.split(":")
    tc_in = f"00:{int(mm):02d}:{int(ss):02d}"
    total = int(mm) * 60 + int(ss) + dur
    tc_out = f"00:{total // 60:02d}:{total % 60:02d}"
    return {
        "id": sid,
        "scene": scene,
        "tc": tc,
        "tc_in": tc_in,
        "tc_out": tc_out,
        "dur": dur,
        "size": size,
        "title": title,
        "camera": camera,
        "action": action,
        "dialogue": dialogue,
        "lock_ids": lock_ids,
        "ref_ids": ref_ids,
        "refs": list(dict.fromkeys(sum((REFS.get(r, []) for r in ref_ids), []))),
        "prompt": prompt_for(camera, action, lock_ids, ref_ids),
        "negative": NEGATIVE,
    }


SCENES = [
    {
        "id": "01",
        "act": "I",
        "tc": "0:00–0:22",
        "heading": "SCENE 01  EXT. GLOW-A-LOT CARNIVAL - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "A cozy autumn carnival glows on the edge of town. A gold-and-purple FERRIS WHEEL "
                    "turns slow as a lullaby. Fairy lights stitch the midway together. A wooden arch reads "
                    "GLOW-A-LOT CARNIVAL — FALL FEST. Kids weave past cotton candy and bumper cars. "
                    "Center stage: a GIANT smiling PUMPKIN PIGGY-BANK on a pedestal, wrapped in string lights. "
                    "A banner flaps: KINDNESS PUMPKIN — COINS FOR THE PETTING ZOO!"
                ),
            },
            {
                "type": "action",
                "text": (
                    "A LITTLE GIRL on her dad's shoulders drops a coin into the slot. The pumpkin RATTLES "
                    "from somewhere deep inside — too alive for a wooden box. A pale shape flutters past "
                    "the Ferris wheel and is gone."
                ),
            },
            {"type": "char", "name": "CARNIVAL KID"},
            {"type": "paren", "text": "(pointing up, whispering)"},
            {"type": "dial", "text": "Did you see that? The Ghost of Glow-A-Lot!"},
            {"type": "char", "name": "CARNIVAL DAD"},
            {"type": "paren", "text": "(forcing a laugh)"},
            {"type": "dial", "text": "It's just the wind, sweetheart. ...Right?"},
            {
                "type": "action",
                "text": (
                    "A gust. A white sheet-like figure WHOOSHES over the pumpkin and melts into the fog. "
                    "The calliope hits a sour note. Coins inside the pumpkin clink like little footsteps."
                ),
            },
        ],
    },
    {
        "id": "02",
        "act": "I",
        "tc": "0:22–0:52",
        "heading": "SCENE 02  INT. TANGO'S BEDROOM - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Blue gear-print wallpaper. Captain Spark posters. A basketball under the desk. "
                    "TANGO, civilian clothes, spins a ball on one finger while a small TABLET on the desk "
                    "plays the news. He is half-watching. Then he isn't."
                ),
            },
            {"type": "char", "name": "REPORTER (ON TABLET)"},
            {"type": "paren", "text": "(breathless)"},
            {
                "type": "dial",
                "text": (
                    "...Glow-A-Lot Carnival closed early after guests reported a floating white phantom "
                    "circling the Kindness Pumpkin. Donations for the petting zoo were left sitting in the open!"
                ),
            },
            {
                "type": "action",
                "text": "Tango stops the ball with both hands. His eyes go dinner-plate wide.",
            },
            {"type": "char", "name": "TANGO"},
            {"type": "dial", "text": "Bravo. Bravo. BRAVO."},
            {
                "type": "action",
                "text": (
                    "He slaps his communicator. BRAVO's face pops up in a tiny holo — already wearing "
                    "that I-have-a-theory look, glasses catching the desk lamp."
                ),
            },
            {"type": "char", "name": "BRAVO (COMM)"},
            {
                "type": "dial",
                "text": (
                    "I saw it. Floating white mass. Unexplained rattle. Charity money sitting in the open. "
                    "That is not a ghost, Tango. That is a problem."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(already grabbing his cap)"},
            {"type": "dial", "text": "Race you to the lab. Loser cleans Pipi's propellers."},
        ],
    },
    {
        "id": "03",
        "act": "I",
        "tc": "0:52–1:22",
        "heading": "SCENE 03  INT. BRAVO'S SECRET LAB - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Chrome panels. Teal strip lights. Two glass SUIT TUBES glow — purple-gold and teal-green. "
                    "PIPI zips a figure-eight over the work table, visor smiling. Bravo is already at the "
                    "curved holo-desk. Tango jogs in, basketball abandoned by the stairs."
                ),
            },
            {"type": "char", "name": "PIPI"},
            {"type": "paren", "text": "(bright, chirpy)"},
            {
                "type": "dial",
                "text": "Scan complete. One giant pumpkin. Many coins. One very suspicious fog cloud.",
            },
            {"type": "char", "name": "BRAVO"},
            {"type": "paren", "text": "(tapping the hologram)"},
            {
                "type": "dial",
                "text": "Fog on a clear night? That's not weather. That's a machine.",
            },
            {"type": "char", "name": "TANGO"},
            {
                "type": "dial",
                "text": "And I know two guys who love machines that make trouble. Also hats. Very committed to hats.",
            },
            {
                "type": "action",
                "text": (
                    "The suit tubes hiss open. Bravo pulls the green helmet on in one practiced shove. "
                    "Tango snaps the gold visor down and points finger-guns at Pipi. Pipi finger-guns back "
                    "with a tiny robot arm. A beat of pure kid-superhero joy."
                ),
            },
            {"type": "char", "name": "BRAVO & TANGO"},
            {"type": "dial", "text": "Widgeteers, roll out!"},
        ],
    },
    {
        "id": "04",
        "act": "I",
        "tc": "1:22–1:58",
        "heading": "SCENE 04  EXT. CARNIVAL MIDWAY / BEHIND POPCORN CART - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "The midway is empty, lights still on, popcorn still warm. The Kindness Pumpkin waits "
                    "like a friendly orange moon. Behind a yellow POPCORN CART: CHURRO, smug as a cat in a fedora, "
                    "and MUFFIN, holding a rope tied to a bedsheet and a dented fog machine labeled "
                    "SPOOK-O-MATIC 3000."
                ),
            },
            {"type": "char", "name": "CHURRO"},
            {"type": "paren", "text": "(whisper-shouting, which is not whispering)"},
            {
                "type": "dial",
                "text": "Phase one is working, Muffin. Everyone ran. Now we simply... borrow the pumpkin.",
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "dial", "text": "Borrow? Like a library book? Do pumpkins have due dates?"},
            {"type": "char", "name": "CHURRO"},
            {"type": "paren", "text": "(deadpan)"},
            {"type": "dial", "text": "Yes. Due tonight. In our hideout. With the coins."},
            {"type": "char", "name": "MUFFIN"},
            {
                "type": "dial",
                "text": "Ooooh. Coins can buy so many churros. Wait. That's you. Can they buy muffins?",
            },
            {"type": "char", "name": "CHURRO"},
            {"type": "dial", "text": "Focus. I raise the ghost. You roll the pumpkin. A perfect plan."},
            {
                "type": "action",
                "text": (
                    "Churro yanks the fishing line. The bedsheet RISES like a cheap phantom above the pumpkin. "
                    "Fog belches out, smelling faintly of burnt caramel. The pumpkin RATTLES from inside. "
                    "Neither of them notices a tiny golden eye blink in the coin slot."
                ),
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "paren", "text": "(freezing)"},
            {"type": "dial", "text": "Uh, Churro? Did the pumpkin just... growl?"},
            {"type": "char", "name": "CHURRO"},
            {
                "type": "dial",
                "text": "Pumpkins do not growl. Ghosts growl. Which is us. Which is fake. MOVE.",
            },
        ],
    },
    {
        "id": "05",
        "act": "II",
        "tc": "1:58–2:18",
        "heading": "SCENE 05  EXT. CARNIVAL GATE - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "The Widgeteers sweep in: Tango on the purple JETBIKE, Bravo on the glowing teal SCOOTER, "
                    "Pipi as a third headlight. An empty ticket booth. A dropped stuffed bear. Spooky the way "
                    "a birthday party is spooky after everyone goes home."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(trying to be cool, failing a little)"},
            {"type": "dial", "text": "Okay. Not gonna lie. A little spooky."},
            {"type": "char", "name": "BRAVO"},
            {"type": "dial", "text": "Stay scientific. Eyes up. Coins first. Ghosts... later. Preferably never."},
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Fog signature: bargain brand. Stinky."},
        ],
    },
    {
        "id": "06",
        "act": "II",
        "tc": "2:18–2:42",
        "heading": "SCENE 06  EXT. MIDWAY / KINDNESS PUMPKIN - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "They approach the pumpkin. Bravo's wrist scanner hums a polite, unimpressed beep. "
                    "Behind them — we stay on their BACKS — the bedsheet ghost RISES, fog curling around "
                    "their boots. Tango whirls."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(voice cracking, then dropping two octaves on purpose)"},
            {"type": "dial", "text": "G-g-ghost! I mean. Ghost. Hi. We're professionals."},
            {
                "type": "action",
                "text": (
                    "The sheet snags on a popcorn box. A fishing line CATCHES the light like a spider thread. "
                    "Bravo pinches it between two fingers, delighted."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {"type": "dial", "text": "That's not ectoplasm. That's fishing line. Twelve-pound test. Very earthly."},
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "And a coupon still stuck to the fog machine."},
            {
                "type": "action",
                "text": "The 'ghost' panics and dives toward the bumper cars, sheet flapping like bad laundry.",
            },
        ],
    },
    {
        "id": "07",
        "act": "II",
        "tc": "2:42–3:08",
        "heading": "SCENE 07  EXT. BUMPER CARS - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Churro slaps a stolen lever. Bumper cars SPARK awake and start a riderless rumba. "
                    "The Widgeteers hop the rails. Muffin, wearing the sheet, stumbles into a spinning car "
                    "and becomes a round white dreidel of regret."
                ),
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "paren", "text": "(muffled, spinning)"},
            {"type": "dial", "text": "I am a very dizzy ghost!"},
            {"type": "char", "name": "CHURRO (O.S.)"},
            {"type": "dial", "text": "Stop narrating, you walnut!"},
            {
                "type": "action",
                "text": (
                    "Pipi dives under the control box and YANKS a plug with her little arm. Cars freeze mid-bump. "
                    "The sheet flies off the empty car and lands on a stuffed prize llama. The crooks are already "
                    "waddling toward the Hall of Mirrors."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {"type": "dial", "text": "Hall of Mirrors. Of course. Because running in a straight line is too honest."},
        ],
    },
    {
        "id": "08",
        "act": "II",
        "tc": "3:08–3:32",
        "heading": "SCENE 08  INT. HALL OF MIRRORS - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Wacky glass. Hero suits warp into noodle-Bravo and basketball-Tango. Twenty MUFFINS "
                    "waddle in twenty directions. Pipi paints a teal scan-line across the floor. One trail "
                    "of popcorn kernels leads to the real one."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "Real burglars leave real footprints. Ghosts don't eat popcorn. Also ghosts don't exist.",
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(scooping a kernel)"},
            {"type": "dial", "text": "This one has butter. Very haunted butter."},
            {
                "type": "action",
                "text": (
                    "They burst out the EXIT into night air. Down the midway, two silhouettes are trying — "
                    "and failing — to lift a pumpkin the size of a small car."
                ),
            },
        ],
    },
    {
        "id": "09",
        "act": "III",
        "tc": "3:32–4:12",
        "heading": "SCENE 09  EXT. KINDNESS PUMPKIN - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "Churro heaves. Muffin heaves. The pumpkin does not heave. Muffin sits on it to "
                    "'push with his sit.' The pedestal TIPS. The Kindness Pumpkin ROLLS — a giant orange "
                    "boulder thundering down the midway. Coins jingle a panic song."
                ),
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "dial", "text": "The library book is escaping!"},
            {"type": "char", "name": "CHURRO"},
            {"type": "dial", "text": "That is not how libraries work!"},
            {
                "type": "action",
                "text": (
                    "Chase. Tracking alongside the pumpkin. Tango bounce-kicks a parked bumper car into a "
                    "soft stop. Bravo lassos the stem with a prize-booth rope. The pumpkin kisses the "
                    "Ferris wheel base and STOPS. The bedsheet settles over Muffin like a failed magic trick."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {"type": "paren", "text": "(grabbing the sheet)"},
            {"type": "dial", "text": "Let's see who our phantom really is..."},
            {
                "type": "action",
                "text": (
                    "YANK. MUFFIN blinks, beanie crooked, mask askew. CHURRO tries to sneak away with a "
                    "fistful of spilled coins. Pipi MAGNET-BEEPS. The coins leap into her little tray like "
                    "trained fish."
                ),
            },
            {"type": "char", "name": "CHURRO"},
            {
                "type": "dial",
                "text": "It would have worked if the pumpkin wasn't so... pumpkin-y!",
            },
            {"type": "char", "name": "TANGO"},
            {
                "type": "dial",
                "text": "You tried to steal donations for the petting zoo.",
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "paren", "text": "(genuinely crushed)"},
            {
                "type": "dial",
                "text": "I didn't know the zoo was pets. I thought it was... zoo-coins. For snacks.",
            },
            {
                "type": "action",
                "text": (
                    "They hog-tie the crooks to the popcorn cart with stuffed-animal prize strings. "
                    "A plush llama now guards Churro's fedora. Bravo plants his fists on his hips, satisfied."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {"type": "dial", "text": "No ghosts. Just two very loud, very caught crooks."},
        ],
    },
    {
        "id": "10",
        "act": "III",
        "tc": "4:12–4:48",
        "heading": "SCENE 10  EXT. KINDNESS PUMPKIN / FERRIS WHEEL - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "A soft HOOOOOT. A small white figure lifts off the pumpkin lid and drifts, cape fluttering. "
                    "Everyone freezes. Even Churro. Especially Muffin."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(tiny voice)"},
            {"type": "dial", "text": "Uh, Bravo? You said no ghosts."},
            {
                "type": "action",
                "text": (
                    "Pipi throws a gentle spotlight. The figure lands on the pumpkin's stem. It is HOOT — "
                    "a tiny white barn owl tangled in a magician's cape from the prize booth, two poked "
                    "eye-holes making her look like the world's shyest baby ghost."
                ),
            },
            {"type": "char", "name": "PIPI"},
            {"type": "dial", "text": "Lifeform: owl. Mood: shy. Last known address: pumpkin."},
            {
                "type": "action",
                "text": (
                    "Bravo lifts the cape as if it were a blanket. Under the lid: a nest of raffle tickets "
                    "and the pumpkin's warm night-bulb. Hoot blinks. Bravo blinks back, scientist melted."
                ),
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "She made a nest in the Kindness Pumpkin. The rattle was coins hitting her bedtime.",
            },
            {"type": "char", "name": "TANGO"},
            {"type": "paren", "text": "(soft, grinning)"},
            {"type": "dial", "text": "Aw. The Ghost of Glow-A-Lot was just hungry for a nap."},
            {
                "type": "action",
                "text": "Hoot hop-hops onto Tango's gold helmet and sits like a feathery siren.",
            },
            {"type": "char", "name": "MUFFIN"},
            {"type": "dial", "text": "Can we keep her? She can be Ghost... Junior."},
            {"type": "char", "name": "CHURRO"},
            {"type": "dial", "text": "We are literally tied to a popcorn cart."},
            {
                "type": "action",
                "text": (
                    "Carnival folks flood back, laughing now. A kind PETTING-ZOO KEEPER lifts Hoot like a cupcake. "
                    "Kids drop coins again. The pumpkin's painted smile seems, somehow, even friendlier."
                ),
            },
        ],
    },
    {
        "id": "11",
        "act": "III",
        "tc": "4:48–5:00",
        "heading": "SCENE 11  EXT. FERRIS WHEEL - NIGHT",
        "blocks": [
            {
                "type": "action",
                "text": (
                    "The Widgeteers ride the Ferris wheel, city lights below. Pipi matches HOOT in a little "
                    "loop-the-loop beside the gondola. The midway is alive again. Down below, Muffin and Churro "
                    "wait for actual police, still wearing a llama."
                ),
            },
            {"type": "char", "name": "TANGO"},
            {
                "type": "dial",
                "text": "So the scary thing was a sleepy owl and two guys who can't lift a pumpkin.",
            },
            {"type": "char", "name": "BRAVO"},
            {
                "type": "dial",
                "text": "Most mysteries are just someone needing help. Or a snack.",
            },
            {"type": "char", "name": "MUFFIN (O.S.)"},
            {"type": "paren", "text": "(from very far below)"},
            {"type": "dial", "text": "I still need a snack!"},
            {
                "type": "action",
                "text": (
                    "They laugh. The wheel carries them up into gold-purple night. Pipi's visor draws a tiny "
                    "heart. FADE OUT."
                ),
            },
            {"type": "action", "text": "THE END"},
        ],
    },
]


SHOTS = [
    shot(
        "S01", "01", "0:00", 4, "EWS",
        "Carnival from behind the Ferris wheel",
        "High crane parked BEHIND the Ferris wheel. The wheel fills the left foreground as a dark lace silhouette. We look WITH it down into the midway. Slow drift downward. Do not show a postcard-flat establishing poster.",
        "Night autumn carnival seen through Ferris wheel spokes, gold-purple lights, tiny people, Kindness Pumpkin glowing in the distance like a hearth.",
        ["carnival", "pumpkin"], [],
    ),
    shot(
        "S02", "01", "0:04", 4, "WS",
        "Push through the Glow-A-Lot arch",
        "Steadicam at a kid's eye-line, moving UNDER and through the wooden entrance arch. The camera is slightly behind a family walking in, so we see their backs and the carnival opening like a curtain.",
        "Wooden arch GLOW-A-LOT CARNIVAL — FALL FEST, fairy lights, fallen leaves, cotton-candy stall to the right, calliope in the deep background.",
        ["carnival"], [],
    ),
    shot(
        "S03", "01", "0:08", 5, "OTS",
        "Coin drop, over the girl's shoulder",
        "Classic over-the-shoulder: camera sits on the little girl's right shoulder, her cheek and hair in soft-focus foreground. She is looking AWAY from us toward the pumpkin. Dad's hands hold her waist.",
        "Child dropping a gold coin toward the Kindness Pumpkin slot. Warm string lights. Friendly carved pumpkin smile filling the end of the frame.",
        ["carnival", "pumpkin"], [],
        dialogue="(no line — coin clink)",
    ),
    shot(
        "S04", "01", "0:13", 4, "ECU",
        "Slot rattles",
        "Macro insert, camera almost inside the gold coin slot, slightly Dutch. We do not see a face. Light from within the pumpkin, a hint of downy white feather, then darkness. Cinematic insert, not a product shot.",
        "Gold coin disappearing into the pumpkin slot, rattling echo, one tiny pale feather drifting out.",
        ["pumpkin"], [],
    ),
    shot(
        "S05", "01", "0:17", 5, "MS",
        "Kid spots the pale shape",
        "Profile two-shot. The carnival kid is in profile looking UP and LEFT into the sky, not at camera. Dad behind him, also in profile. Background: Ferris wheel with a pale sheet-shape sliding behind a gondola.",
        "Child pointing up, whispering, father forcing a smile. Pale flutter near the wheel. Fog, not horror.",
        ["carnival"], [],
        dialogue='CARNIVAL KID: "Did you see that? The Ghost of Glow-A-Lot!"',
    ),
    shot(
        "S06", "01", "0:22", 5, "WS",
        "Sheet-whoosh over the pumpkin",
        "Low angle from behind the pumpkin pedestal so the pumpkin's back/stem dominates the foreground. A white sheet-shape streaks OVER us toward deep fog. Calliope in bokeh.",
        "White fluttering sheet passing over the Kindness Pumpkin, fog, empty midway starting to thin out.",
        ["carnival", "pumpkin"], [],
    ),
    shot(
        "S07", "02", "0:27", 6, "WS",
        "Tango's room from behind the chair",
        "Camera in the bedroom doorway, slightly high. We see TANGO FROM BEHIND at his desk, cap brim, hoodie back, basketball in his right hand. Tablet glows. Match the bedroom layout exactly.",
        "Tango civilian sitting at the wooden desk in his blue gear-wallpaper room at night, watching news, not posing.",
        ["tango_civ", "tango_room"], ["tango_civ", "tango_room"],
    ),
    shot(
        "S08", "02", "0:33", 5, "CU",
        "News on the tablet",
        "Over-the-shoulder insert: Tango's fingers and a slice of his cheek in the foreground, tablet screen in focus showing a reporter in front of a carnival pumpkin. We are looking at the screen, not at Tango's face.",
        "Tablet playing carnival ghost news, Kindness Pumpkin on screen, Tango's hand paused on a basketball.",
        ["tango_civ", "pumpkin"], ["tango_civ"],
        dialogue='REPORTER: "...a floating white phantom circling the Kindness Pumpkin."',
    ),
    shot(
        "S09", "02", "0:38", 6, "MS",
        "Tango spins, three-quarter",
        "The desk chair SWINGS. Camera is at 45 degrees, never square. Tango ends in a three-quarter view looking toward the communicator on the desk, mouth mid-shout, basketball hugged to his chest. Lamp rim-light on the cap.",
        "Tango civilian reacting to the news, wide eyes, cap, grey hoodie, blue room.",
        ["tango_civ", "tango_room"], ["tango_civ", "tango_room"],
        dialogue='TANGO: "Bravo. Bravo. BRAVO."',
    ),
    shot(
        "S10", "02", "0:44", 8, "OTS",
        "Communicator two-shot",
        "Over Tango's shoulder as he leans toward a hovering holo of Bravo. Tango's back and cap fill the left third. Bravo's civilian face lives inside the holo, small, lit practical. Split of two rooms, cinematic, not a Zoom screenshot.",
        "Tango in his bedroom talking to Bravo on a communicator hologram. Bravo civilian with glasses and curly red hair.",
        ["tango_civ", "bravo_civ", "tango_room"], ["tango_civ", "bravo_civ", "tango_room"],
        dialogue='BRAVO: "That is not a ghost, Tango. That is a problem."',
    ),
    shot(
        "S11", "03", "0:52", 6, "WS",
        "Entering the lab from behind",
        "Wide from the lab stairs. Bravo and Tango are WALKING AWAY from camera into the room, civilian clothes, Pipi hovering ahead of them like a guide light. Suit tubes glow on the right. Do not line them up facing us.",
        "Secret lab, teal lights, two kids entering from behind, spherical white drone leading.",
        ["bravo_civ", "tango_civ", "pipi", "lab"], ["bravo_civ", "tango_civ", "pipi", "lab"],
    ),
    shot(
        "S12", "03", "0:58", 6, "MS",
        "Pipi at the hologram",
        "Low side angle. Pipi hovers in profile in the foreground, one little arm pointing at a carnival map hologram. Bravo civilian is beyond her, out of focus, studying the map in three-quarter back view.",
        "Pipi presenting a holo-map of Glow-A-Lot, Bravo listening with his back partly to us.",
        ["pipi", "bravo_civ", "lab", "carnival"], ["pipi", "bravo_civ", "lab"],
        dialogue='PIPI: "One giant pumpkin. Many coins. One very suspicious fog cloud."',
    ),
    shot(
        "S13", "03", "1:04", 6, "MCU",
        "Bravo's theory, profile",
        "Strict profile close-up of Bravo civilian, glasses catching teal lab light, looking RIGHT at the hologram, not at us. Mouth mid-line. Soft lab bokeh.",
        "Bravo explaining the fog is a machine, inventor energy, not a poster smirk.",
        ["bravo_civ", "lab"], ["bravo_civ", "lab"],
        dialogue='BRAVO: "Fog on a clear night? That\'s not weather. That\'s a machine."',
    ),
    shot(
        "S14", "03", "1:10", 6, "MS",
        "Suit tubes hiss open",
        "Camera beside the tubes, shooting along them. Bravo and Tango reach IN, mostly backs and reaching arms. Glass, teal and gold reflections. Motion, not a costume display.",
        "Hero suit tubes opening, kids grabbing helmets, lab practicals.",
        ["bravo_civ", "tango_civ", "bravo_hero", "tango_hero", "lab"],
        ["bravo_civ", "tango_civ", "bravo_hero", "tango_hero", "lab"],
    ),
    shot(
        "S15", "03", "1:16", 6, "MS",
        "Visors down, off-center",
        "Medium shot but FRAMED WRONG on purpose: Bravo hero on the left looking at Tango, Tango hero on the right looking at Bravo, both in three-quarter, visors snapping. Pipi between them as a teal spark. They do not face the lens.",
        "Widgeteers suited up, visors down, Pipi looping, ready to roll.",
        ["bravo_hero", "tango_hero", "pipi", "lab"],
        ["bravo_hero", "tango_hero", "pipi", "lab"],
        dialogue='BRAVO & TANGO: "Widgeteers, roll out!"',
    ),
    shot(
        "S16", "04", "1:22", 6, "WS",
        "Empty midway, pumpkin waiting",
        "Wide, camera low behind a popcorn box in the foreground (out of focus yellow cardboard). The Kindness Pumpkin sits mid-frame. Tiny silhouettes of Muffin and Churro crouch behind a cart in the deep right. Haunted-empty, still colorful.",
        "Deserted carnival midway at night, Kindness Pumpkin glowing, crooks hiding.",
        ["carnival", "pumpkin", "muffin", "churro"], ["muffin", "churro"],
    ),
    shot(
        "S17", "04", "1:28", 7, "OTS",
        "Crooks behind the popcorn cart",
        "Camera among the popcorn boxes. We are behind CHURRO's coat and hat brim. MUFFIN is beyond him in three-quarter, hugging the fog machine. They look toward the pumpkin, not at us.",
        "Churro and Muffin hiding, Spook-o-Matic 3000, fishing line, Kindness Pumpkin out of focus beyond.",
        ["churro", "muffin", "pumpkin", "carnival"], ["churro", "muffin", "duo"],
        dialogue='CHURRO: "Now we simply... borrow the pumpkin."',
    ),
    shot(
        "S18", "04", "1:35", 6, "CU",
        "Muffin's library-book brain",
        "Close three-quarter of Muffin, beanie, mask, looking slightly off-camera toward Churro (who is a fedora blur in the foreground). Confused hopeful face. Not a beauty headshot.",
        "Muffin asking if pumpkins have due dates, round face, black beanie and mask.",
        ["muffin", "churro"], ["muffin", "churro"],
        dialogue='MUFFIN: "Borrow? Like a library book? Do pumpkins have due dates?"',
    ),
    shot(
        "S19", "04", "1:41", 6, "MCU",
        "Churro deadpan",
        "Churro in three-quarter, looking down at Muffin, fedora brim cutting the top of frame, coat collar up. Smug. Rim-lit by carnival gold. He is not square to camera.",
        "Churro explaining the due date is tonight, skinny burglar, mustache, mask.",
        ["churro", "muffin"], ["churro", "muffin"],
        dialogue='CHURRO: "Yes. Due tonight. In our hideout. With the coins."',
    ),
    shot(
        "S20", "04", "1:47", 6, "WS",
        "Sheet rises on fishing line",
        "Low wide. Pumpkin in foreground (we see its back). A white bedsheet lifts on a visible fishing line into the fog. Churro's arm in the deep background yanking. A pin-prick gold owl eye in the coin slot.",
        "Fake ghost sheet rising over the Kindness Pumpkin, fog machine smoke, carnival night.",
        ["pumpkin", "carnival", "churro", "hoot"], ["churro"],
    ),
    shot(
        "S21", "04", "1:53", 5, "CU",
        "Did the pumpkin growl?",
        "Muffin leans into frame from the left, profile, whispering toward the pumpkin which occupies the right. His mouth is a little 'o'. Cute scare, not horror.",
        "Muffin frightened by the pumpkin rattle, Churro unimpressed in the bokeh.",
        ["muffin", "pumpkin", "churro"], ["muffin", "churro"],
        dialogue='MUFFIN: "Uh, Churro? Did the pumpkin just... growl?"',
    ),
    shot(
        "S22", "05", "1:58", 7, "WS",
        "Widgeteers arrive at the gate",
        "Tracking from behind the vehicles as they enter the gate: Tango on the purple jetbike LEFT, Bravo on the teal scooter RIGHT, Pipi as a third lamp. We see helmet backs and taillights. Arch overhead.",
        "Heroes arriving at the empty carnival, jetbike and scooter, night.",
        ["bravo_hero", "tango_hero", "pipi", "carnival"],
        ["bravo_hero", "tango_hero", "pipi", "jetbike", "scooter"],
    ),
    shot(
        "S23", "05", "2:05", 6, "OTS",
        "A little spooky",
        "Over Bravo's green helmet shoulder. Tango hero is beyond, three-quarter, trying to look brave, empty ticket booth behind him. Pipi scans a dropped teddy bear in the dirt.",
        "Tango admitting it is spooky, Bravo facing the midway, Pipi scanning.",
        ["bravo_hero", "tango_hero", "pipi", "carnival"],
        ["bravo_hero", "tango_hero", "pipi"],
        dialogue='TANGO: "Okay. Not gonna lie. A little spooky."',
    ),
    shot(
        "S24", "06", "2:11", 6, "WS",
        "Walking toward the pumpkin, backs",
        "Follow-cam behind two small superheroes walking AWAY from us down the midway. Pipi between their shoulders. The Kindness Pumpkin grows in frame. Classic kids-adventure blocking.",
        "Bravo and Tango in hero suits approaching the donation pumpkin from behind.",
        ["bravo_hero", "tango_hero", "pipi", "pumpkin", "carnival"],
        ["bravo_hero", "tango_hero", "pipi"],
    ),
    shot(
        "S25", "06", "2:17", 6, "WS",
        "Ghost rises behind them",
        "We STAY behind the heroes. The bedsheet ghost rises in the gap between their helmets, above the pumpkin. Tango's shoulders hitch. This is the anti-poster shot: we read the scare from their backs.",
        "Fake ghost appearing behind Bravo and Tango while they face the pumpkin.",
        ["bravo_hero", "tango_hero", "pumpkin", "carnival"],
        ["bravo_hero", "tango_hero"],
        dialogue='TANGO: "G-g-ghost! I mean. Ghost. Hi. We\'re professionals."',
    ),
    shot(
        "S26", "06", "2:23", 5, "ECU",
        "Fishing line catchlight",
        "Insert. Bravo's gloved fingers pinch a glinting fishing line. Sheet fabric in the top of frame. Popcorn box snag. Scientific delight, not a product macro.",
        "Hero glove holding fishing line attached to the fake ghost sheet.",
        ["bravo_hero"], ["bravo_hero"],
        dialogue='BRAVO: "That\'s not ectoplasm. That\'s fishing line."',
    ),
    shot(
        "S27", "06", "2:28", 6, "MS",
        "Ghost dives to bumper cars",
        "Whip-pan feeling: sheet-ghost (Muffin inside) runs AWAY from camera toward bumper cars, fog trailing. Heroes in the foreground as helmet-edges only. Directional chase geography.",
        "Sheet-covered Muffin fleeing toward the bumper-car rink.",
        ["muffin", "bravo_hero", "tango_hero", "carnival"],
        ["muffin", "bravo_hero", "tango_hero"],
    ),
    shot(
        "S28", "07", "2:34", 6, "High",
        "Bumper cars riderless rumba",
        "High 45-degree angle over the rink. Cars spark and bump with no drivers. Heroes hop the rail in the lower third, small. Muffin-as-sheet is a white blob in one spinning car. Playground chaos, not a poster.",
        "Night bumper-car ride gone haywire, Pixar carnival, heroes entering the frame from below.",
        ["bravo_hero", "tango_hero", "muffin", "carnival"],
        ["bravo_hero", "tango_hero", "muffin"],
    ),
    shot(
        "S29", "07", "2:40", 6, "MS",
        "Dizzy ghost Muffin",
        "Camera mounted as if on the opposite bumper car, so Muffin in a sheet spins PAST us, round body, beanie visible under the sheet hem, mouth a wobble. Churro is a skinny smear yelling from the rail, back partly to us.",
        "Muffin stuck in a spinning bumper car under a ghost sheet, comic, not scary.",
        ["muffin", "churro"], ["muffin", "churro"],
        dialogue='MUFFIN: "I am a very dizzy ghost!"',
    ),
    shot(
        "S30", "07", "2:46", 6, "CU",
        "Pipi pulls the plug",
        "Under-the-box angle. Pipi in profile yanks a chunky plug with her skinny arm, visor determined. Sparks. Hero boots in the background, out of focus.",
        "Pipi cutting power to the bumper cars, cute drone hero moment.",
        ["pipi", "bravo_hero"], ["pipi", "bravo_hero"],
    ),
    shot(
        "S31", "07", "2:52", 6, "WS",
        "Sheet on a prize llama",
        "Wide as cars freeze. The empty sheet settles on a stuffed llama. Heroes seen from behind, looking toward the Hall of Mirrors whose entrance yawns in the deep background. Crooks are two distant hats.",
        "Aftermath of bumper-car gag, chase continuing to the Hall of Mirrors.",
        ["bravo_hero", "tango_hero", "pipi", "carnival"],
        ["bravo_hero", "tango_hero", "pipi"],
        dialogue='TANGO: "Hall of Mirrors. Of course."',
    ),
    shot(
        "S32", "08", "2:58", 7, "WS",
        "Infinite Muffins",
        "Camera behind Bravo and Tango as they face a corridor of mirrors. We see their backs and, in the glass, twenty warped Muffins. The real Muffin is the only one leaving a popcorn trail. Play the depth, not a group portrait.",
        "Hall of mirrors, Widgeteers from behind, many Muffin reflections.",
        ["bravo_hero", "tango_hero", "muffin", "pipi"],
        ["bravo_hero", "tango_hero", "muffin", "pipi"],
        dialogue='BRAVO: "Ghosts don\'t eat popcorn. Also ghosts don\'t exist."',
    ),
    shot(
        "S33", "08", "3:05", 6, "Low",
        "Butter popcorn trail",
        "Very low tracking along a line of popcorn kernels on black-and-white funhouse floor. In the distance, hero boots and Pipi's glow follow the trail. Tango's glove scoops one kernel at the end of the move.",
        "Insert trail of popcorn leading out of the Hall of Mirrors.",
        ["tango_hero", "pipi"], ["tango_hero", "pipi"],
        dialogue='TANGO: "This one has butter. Very haunted butter."',
    ),
    shot(
        "S34", "09", "3:11", 6, "MS",
        "They cannot lift the pumpkin",
        "Side-on medium. Churro and Muffin strain against the Kindness Pumpkin, bodies leaning, faces in profile. The pumpkin does not move. Comedy of weight. Pedestal starting to tip.",
        "Two burglars failing to steal a giant pumpkin piggy-bank.",
        ["churro", "muffin", "pumpkin", "carnival"], ["churro", "muffin", "duo"],
    ),
    shot(
        "S35", "09", "3:17", 6, "WS",
        "Pumpkin boulder rolls",
        "Tracking shot DOLLYING beside the rolling pumpkin as it thunders down the midway. Muffin runs after it in the background, tiny legs. Lights streak. Heroic cartoon physics, kid-safe.",
        "Giant Kindness Pumpkin rolling like a boulder, coins jingling, carnival booths whipping by.",
        ["pumpkin", "muffin", "churro", "carnival"], ["muffin", "churro"],
        dialogue='MUFFIN: "The library book is escaping!"',
    ),
    shot(
        "S36", "09", "3:23", 6, "MS",
        "Tango intercept",
        "Camera low in front of Tango hero as he bounce-kicks a bumper car into the pumpkin's path — but we are slightly to his side so his face is three-quarter, body in action, not a power-pose poster. Bravo's rope enters from the right.",
        "Tango stopping the rolling pumpkin with carnival physics, Bravo lassoing the stem.",
        ["tango_hero", "bravo_hero", "pumpkin"], ["tango_hero", "bravo_hero"],
    ),
    shot(
        "S37", "09", "3:29", 6, "MCU",
        "Unmask",
        "Over Bravo's shoulder as his hand YANKS the sheet. Muffin's round face is revealed three-quarter, beanie crooked, blinking. Ferris wheel bokeh behind. Classic Scooby unmask, Pixar-soft.",
        "Bravo hero unmasking Muffin the burglar under a ghost sheet.",
        ["bravo_hero", "muffin", "churro"], ["bravo_hero", "muffin", "churro"],
        dialogue='BRAVO: "Let\'s see who our phantom really is..."',
    ),
    shot(
        "S38", "09", "3:35", 6, "CU",
        "Pipi yoinks the coins",
        "Churro in profile clutching coins, looking back over his shoulder (we see his cheek and fedora). Pipi in the foreground MAGNET-pulls the coins into a tray, visor smug. Coins as sparkles mid-air.",
        "Pipi retrieving stolen petting-zoo coins from Churro.",
        ["pipi", "churro"], ["pipi", "churro"],
        dialogue='CHURRO: "It would have worked if the pumpkin wasn\'t so pumpkin-y!"',
    ),
    shot(
        "S39", "09", "3:41", 7, "WS",
        "Tied to the popcorn cart",
        "Wide, slightly high. Muffin and Churro sit hog-tied to the popcorn cart with stuffed-animal strings. A plush llama wears Churro's fedora. Widgeteers stand with their BACKS partly to us, looking at the crooks. Pipi boops Muffin's nose.",
        "Crooks captured at the carnival, heroes from behind, comic defeat.",
        ["muffin", "churro", "bravo_hero", "tango_hero", "pipi", "carnival"],
        ["muffin", "churro", "bravo_hero", "tango_hero", "pipi", "duo"],
        dialogue='BRAVO: "No ghosts. Just two very loud, very caught crooks."',
    ),
    shot(
        "S40", "10", "3:48", 6, "WS",
        "The second ghost lifts off",
        "Wide freeze. Everyone in the frame looks UP and AWAY from camera toward a small white cape-shape lifting off the pumpkin lid. Faces in profile/three-quarter. Quiet, wondrous, not jump-scare horror.",
        "Tiny white figure rising from the Kindness Pumpkin, heroes and crooks watching.",
        ["hoot", "pumpkin", "bravo_hero", "tango_hero", "muffin", "churro", "pipi"],
        ["bravo_hero", "tango_hero", "muffin", "churro", "pipi"],
        dialogue='TANGO: "Uh, Bravo? You said no ghosts."',
    ),
    shot(
        "S41", "10", "3:54", 7, "MCU",
        "Hoot revealed",
        "Three-quarter close of HOOT perched on the pumpkin stem, cape like a too-big ghost sheet, golden owl eyes, Pipi's teal spotlight from off-camera left. Soft beauty light, children's film, never scary.",
        "Tiny white barn owl in a magician's cape looking like a baby ghost, adorable.",
        ["hoot", "pumpkin", "pipi"], ["pipi"],
        dialogue='PIPI: "Lifeform: owl. Mood: shy. Last known address: pumpkin."',
    ),
    shot(
        "S42", "10", "4:01", 6, "OTS",
        "Nest in the lid",
        "Over Bravo's helmet as he lifts the pumpkin lid. Nested raffle tickets and a warm bulb. Hoot's blurry wing in the foreground. Intimate, from behind the hero.",
        "Inside of the Kindness Pumpkin lid, owl nest of tickets, Bravo discovering the truth.",
        ["bravo_hero", "hoot", "pumpkin"], ["bravo_hero"],
        dialogue='BRAVO: "The rattle was coins hitting her bedtime."',
    ),
    shot(
        "S43", "10", "4:07", 6, "MS",
        "Hoot on Tango's helmet",
        "Side view. Tango hero in profile, gold helmet, Hoot sitting on top like a feathery hat. Bravo in the background, three-quarter, melted-scientist smile. Warm string lights.",
        "Owl perched on Tango's gold helmet, Bravo smiling, carnival night.",
        ["tango_hero", "hoot", "bravo_hero"], ["tango_hero", "bravo_hero"],
        dialogue='TANGO: "The Ghost of Glow-A-Lot was just hungry for a nap."',
    ),
    shot(
        "S44", "10", "4:13", 6, "MCU",
        "Ghost Junior",
        "Muffin and Churro tied in the foreground, three-quarter, looking toward Hoot off-screen. Muffin hopeful, Churro done with life. Llama fedora in frame. Comedy two-shot, not a lineup.",
        "Captured burglars reacting to the owl, Muffin wanting to keep her.",
        ["muffin", "churro", "hoot"], ["muffin", "churro"],
        dialogue='MUFFIN: "Can we keep her? She can be Ghost... Junior."',
    ),
    shot(
        "S45", "10", "4:19", 7, "WS",
        "The midway comes back",
        "Wide from behind the pumpkin. Families return, kids dropping coins, petting-zoo keeper receiving Hoot (we see the keeper's back). Heroes small in the right third. Life restored, golden light.",
        "Carnival crowd returning, donations flowing, owl going home, Widgeteers watching from the side.",
        ["pumpkin", "hoot", "bravo_hero", "tango_hero", "carnival"],
        ["bravo_hero", "tango_hero"],
    ),
    shot(
        "S46", "11", "4:26", 8, "MS",
        "Ferris wheel gondola",
        "Inside/beside the gondola. Bravo and Tango sit in three-quarter, looking OUT at the town, not at us. Pipi and Hoot fly a loop outside the bar. City bokeh. Gentle. End-of-episode warmth.",
        "Widgeteers riding the Ferris wheel at night, drone and owl flying beside them.",
        ["bravo_hero", "tango_hero", "pipi", "hoot", "carnival"],
        ["bravo_hero", "tango_hero", "pipi"],
        dialogue='TANGO: "So the scary thing was a sleepy owl and two guys who can\'t lift a pumpkin."',
    ),
    shot(
        "S47", "11", "4:34", 8, "CU",
        "Most mysteries",
        "Profile close of Bravo hero, visor reflecting the wheel lights, speaking toward Tango off-frame. Soft, earned wisdom, kid-show sincere, not a PSA talking-head.",
        "Bravo in green helmet delivering the moral in profile.",
        ["bravo_hero"], ["bravo_hero"],
        dialogue='BRAVO: "Most mysteries are just someone needing help. Or a snack."',
    ),
    shot(
        "S48", "11", "4:42", 18, "EWS",
        "Wheel up, fade out",
        "Extreme wide, camera BELOW the rising Ferris wheel looking up so we see gondola undersides and two tiny heroes. Pipi's visor draws a heart in teal light. Muffin is a speck below yelling. Hold, then fade.",
        "Ferris wheel climbing into gold-purple night, carnival alive again, Pixar ending frame.",
        ["bravo_hero", "tango_hero", "pipi", "hoot", "carnival", "muffin"],
        ["bravo_hero", "tango_hero", "pipi", "muffin"],
        dialogue='MUFFIN (O.S.): "I still need a snack!"',
    ),
]


EPISODE = {
    "series": "The Widgeteers",
    "title": "The Ghost of Glow-A-Lot",
    "code": "EP05",
    "runtime": "5:00",
    "runtime_seconds": 300,
    "logline": (
        "When a spooky 'ghost' empties Glow-A-Lot Carnival and eyes the charity pumpkin bank, "
        "the Widgeteers find two lousy burglars — and one very sleepy owl."
    ),
    "moral": "The thing you're scared of might just need a nap. Charity isn't for taking. Look closer.",
    "tone": "Kids 3D Pixar adventure-comedy. Scooby-Doo bones, zero horror.",
    "style_lock": STYLE_LOCK,
    "negative": NEGATIVE,
    "characters": CHARACTERS,
    "locations": LOCATIONS,
    "scenes": SCENES,
    "shots": SHOTS,
    "acts": [
        {"id": "I", "name": "The Setup", "tc": "0:00–1:58"},
        {"id": "II", "name": "The Hunt", "tc": "1:58–3:32"},
        {"id": "III", "name": "The Unmasking", "tc": "3:32–5:00"},
    ],
}


def register_fonts() -> str:
    cour = Path(r"C:\Windows\Fonts\cour.ttf")
    courbd = Path(r"C:\Windows\Fonts\courbd.ttf")
    if cour.exists():
        pdfmetrics.registerFont(TTFont("WGCourier", str(cour)))
        if courbd.exists():
            pdfmetrics.registerFont(TTFont("WGCourier-Bold", str(courbd)))
        else:
            pdfmetrics.registerFont(TTFont("WGCourier-Bold", str(cour)))
        return "WGCourier"
    return "Courier"


def write_json() -> None:
    WEB_JSON.parent.mkdir(parents=True, exist_ok=True)
    WEB_JSON.write_text(json.dumps(EPISODE, indent=2, ensure_ascii=False), encoding="utf-8")


def write_pdf() -> None:
    font = register_fonts()
    bold = f"{font}-Bold" if font == "WGCourier" else "Courier-Bold"
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)

    title_style = ParagraphStyle(
        "TitlePage", fontName=bold, fontSize=22, leading=28, alignment=TA_CENTER, spaceAfter=12
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
        "Dial", fontName=font, fontSize=12, leading=16, alignment=TA_CENTER, leftIndent=72, rightIndent=72, spaceAfter=6
    )
    end_s = ParagraphStyle(
        "End", fontName=bold, fontSize=12, leading=16, alignment=TA_CENTER, spaceBefore=24
    )

    story = []
    story.append(Spacer(1, 3.2 * inch))
    story.append(Paragraph("THE WIDGETEERS", sub_style))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("THE GHOST OF GLOW-A-LOT", title_style))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph("Episode 05  •  Runtime 5:00", sub_style))
    story.append(Paragraph("A Pixar-style 3D children's adventure", sub_style))
    story.append(PageBreak())

    story.append(Paragraph("THE WIDGETEERS  Episode: \"The Ghost of Glow-A-Lot\"", action))
    story.append(Paragraph("Runtime: 5:00", action))
    story.append(
        Paragraph(
            "ACT I: THE SETUP (0:00–1:58) &nbsp;&nbsp; ACT II: THE HUNT (1:58–3:32) "
            "&nbsp;&nbsp; ACT III: THE UNMASKING (3:32–5:00)",
            action,
        )
    )
    story.append(Spacer(1, 0.15 * inch))
    story.append(
        Paragraph(
            f"<i>Logline. {EPISODE['logline']}</i>",
            action,
        )
    )

    for scene in SCENES:
        story.append(Paragraph(scene["heading"] + f"  ({scene['tc']})", heading))
        for block in scene["blocks"]:
            t = block["type"]
            if t == "action":
                txt = block["text"]
                if txt == "THE END":
                    story.append(Paragraph("THE END", end_s))
                else:
                    story.append(Paragraph(txt.replace("\n", "<br/>"), action))
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
            canvas.drawString(0.85 * inch, 0.55 * inch, "THE GHOST OF GLOW-A-LOT")
            canvas.drawRightString(letter[0] - 0.85 * inch, 0.55 * inch, "THE WIDGETEERS")
        canvas.restoreState()

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=letter,
        leftMargin=1.1 * inch,
        rightMargin=1.1 * inch,
        topMargin=1.0 * inch,
        bottomMargin=0.9 * inch,
        title="The Ghost of Glow-A-Lot",
        author="The Widgeteers",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    write_json()
    write_pdf()
    print(f"JSON  {WEB_JSON}")
    print(f"PDF   {PDF_PATH}")
    print(f"scenes {len(SCENES)}  shots {len(SHOTS)}")
