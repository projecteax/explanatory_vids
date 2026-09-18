import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import timeline from "../food-data/timeline.json";
import { BravoVector, type BravoMood, type BravoPose } from "./BravoVector";
import { PipiVector, type PipiMood } from "./PipiVector";
import { FoodCaptions } from "./FoodCaptions";
import { FoodGraphic } from "./FoodGraphics";
import { CameraPlate, Chalkboard } from "./ProductionStage";
import { MouthSourceProvider } from "./MouthSource";
import { plateFor, shotAt, type Shot } from "./foodShotList";

type Line = (typeof timeline.lines)[number];

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const titles = [
  "",
  "SUPER FUEL?",
  "SOMETIMES  OR  EVERYDAY",
  "EVERYDAY FOOD",
  "APPLE IS NOT CANDY",
  "TUMMY BROOM",
  "SUGAR ZAP",
  "SUGAR ON TEETH",
  "NOT A SWISS CHEESE SMILE",
  "SODA IS A SOMETIMES SIP",
  "FACTORY SNACKS",
  "SOMETIMES BOX",
  "WASH FIRST",
  "LICKING IS NOT WASHING",
  "EVERY FOOD HAS A JOB",
  "TONIGHT MISSION",
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
  if ([3, 6, 10, 14].includes(n)) return "point";
  if ([2, 9, 12, 15].includes(n)) return "present";
  if (n === 7) return "think";
  if (speaker === "PIPI") return "idle";
  return "present";
}

function bravoMood(n: number): BravoMood {
  if (n === 1) return "curious";
  if ([2, 8, 13].includes(n)) return "amused";
  if ([3, 4, 7, 9, 10, 12, 14].includes(n)) return "teacher";
  if (n === 6) return "curious";
  if (n === 15) return "proud";
  return "curious";
}

function pipiMood(n: number): PipiMood {
  if (n === 1 || n === 5) return "laugh";
  if (n === 8) return "alarm";
  if (n === 11) return "suspicious";
  if (n === 13) return "curious";
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

export const FoodEpisode: React.FC = () => {
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
      ? interpolate(progress, [0, 0.2], [0, 1], clamp)
      : 1;
  const settle = interpolate(progress, [0, 0.1], [0, 1], clamp);

  return (
    <MouthSourceProvider value="food">
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
              holdItem="apple"
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
            <FoodGraphic line={n} progress={progress} />
          </Chalkboard>
        </CameraPlate>
        <FoodCaptions />
      </AbsoluteFill>
    </MouthSourceProvider>
  );
};
