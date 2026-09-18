import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import timeline from "../production-data/timeline.json";
import { BravoVector, type BravoMood, type BravoPose } from "./BravoVector";
import { PipiVector, type PipiMood } from "./PipiVector";
import { ProductionCaptions } from "./ProductionCaptions";
import { EducationalGraphic } from "./EducationalGraphics";
import { CameraPlate, Chalkboard } from "./ProductionStage";
import { plateFor, shotAt, type Shot } from "./shotList";

type Line = (typeof timeline.lines)[number];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const titles = [
  "",
  "MOON EMERGENCY",
  "THE MYSTERY",
  "SCIENCE SNACK",
  "SECRET 1  THE MOON IS A BALL",
  "MODEL CHECK",
  "SECRET 2  SUNLIGHT",
  "SUNNY SIDE  SLEEPY SIDE",
  "THE MOON ORBITS EARTH",
  "FULL MOON",
  "COOKIE WARNING",
  "NEW MOON",
  "STILL THERE",
  "CRESCENT",
  "MOON BANANA",
  "HALF AND GIBBOUS",
  "THE MONTHLY CYCLE",
  "PIPI'S SUMMARY",
  "LOOK UP TONIGHT",
  "YOUR MOON MISSION",
  "MYSTERY SOLVED",
];

function activeLineAt(seconds: number): Line {
  let active = timeline.lines[0];
  for (const line of timeline.lines) {
    if (seconds >= line.start) active = line;
  }
  return active;
}

function bravoPose(n: number, speaker: string): BravoPose {
  if (n === 4) return "hold";
  if ([6, 8, 9, 11, 13, 15].includes(n)) return "point";
  if ([2, 16, 18, 20].includes(n)) return "present";
  if (speaker === "PIPI") return "idle";
  return "present";
}

function bravoMood(n: number): BravoMood {
  if (n === 2) return "amused";
  if ([8, 11, 16, 18].includes(n)) return "curious";
  if (n === 20) return "proud";
  if (n === 1) return "worried";
  return "teacher";
}

function pipiMood(n: number): PipiMood {
  if (n === 1) return "alarm";
  if ([3, 7, 10, 12, 14, 17, 19].includes(n)) return "laugh";
  if (n === 5) return "curious";
  if ([2, 11].includes(n)) return "suspicious";
  return "focused";
}

function coverage(shot: Shot) {
  switch (shot) {
    case "wide":
      return {
        bravo: { x: 8, y: 408, width: 355, facing: "screen" as const },
        pipi: { x: 300, y: 640, width: 168 },
      };
    case "two":
      return {
        bravo: { x: 6, y: 322, width: 455, facing: "screen" as const },
        pipi: { x: 390, y: 650, width: 168 },
      };
    case "bravoMid":
      return {
        bravo: { x: -8, y: 284, width: 560, facing: "screen" as const },
        pipi: { x: 400, y: 670, width: 150 },
      };
    case "bravoCu":
      return {
        bravo: { x: 180, y: -70, width: 980, facing: "front" as const },
        pipi: null,
      };
    case "pipiCu":
      return {
        bravo: null,
        pipi: { x: 560, y: 200, width: 780 },
      };
    case "board":
      return { bravo: null, pipi: null };
  }
}

export const FullMoonEpisode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const line = activeLineAt(seconds);
  const progress = interpolate(seconds, [line.start, line.end], [0, 1], clamp);
  const n = line.n;
  const speaker = line.speaker;
  const pipiTalks = speaker === "PIPI";
  const shot = shotAt(n, progress);
  const place = coverage(shot);
  const pipiEnter =
    n === 1 && shot === "wide"
      ? interpolate(progress, [0, 0.09], [0, 1], clamp)
      : 1;
  const settle = interpolate(progress, [0, 0.14], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#1a2430",
        color: "#fff",
        fontFamily: "Mikado",
        overflow: "hidden",
      }}
    >
      <CameraPlate plate={plateFor(shot)}>
        {place.bravo ? (
          <BravoVector
            x={place.bravo.x}
            y={place.bravo.y}
            width={place.bravo.width}
            pose={bravoPose(n, speaker)}
            mood={bravoMood(n)}
            speaking={speaker === "BRAVO"}
            facing={place.bravo.facing}
            settle={settle}
          />
        ) : null}
        {place.pipi ? (
          <PipiVector
            x={place.pipi.x}
            y={place.pipi.y}
            width={place.pipi.width}
            mood={pipiMood(n)}
            speaking={pipiTalks}
            enter={pipiEnter}
          />
        ) : null}
        <Chalkboard shot={shot} title={titles[n]}>
          <EducationalGraphic line={n} progress={progress} />
        </Chalkboard>
      </CameraPlate>

      <ProductionCaptions />
    </AbsoluteFill>
  );
};
