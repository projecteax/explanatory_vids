import React from "react";
import {
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import mouthData from "../production-data/mouth-cues.json";

type Speaker = "BRAVO" | "PIPI";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const rhubarbToBravo: Record<string, string> = {
  X: "X",
  A: "X",
  B: "F",
  C: "E",
  D: "A",
  E: "O",
  F: "U",
  G: "F",
  H: "L",
};

const cueAt = (seconds: number) =>
  mouthData.mouthCues.find(
    (cue) => seconds >= cue.start && seconds < cue.end,
  );

export const CharacterSprite: React.FC<{
  character: "bravo" | "pipi";
  asset: string;
  width: number;
  localProgress: number;
  x?: number;
  y?: number;
  enterFrom?: "left" | "right" | "up" | "none";
  flip?: boolean;
  speaking?: boolean;
}> = ({
  character,
  asset,
  width,
  localProgress,
  x = 0,
  y = 0,
  enterFrom = "none",
  flip = false,
  speaking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter =
    enterFrom === "none"
      ? 1
      : interpolate(localProgress, [0, 0.14], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
  const settle = Math.exp(-localProgress * 10) * Math.sin(localProgress * 32);
  const startX = enterFrom === "left" ? -130 : enterFrom === "right" ? 130 : 0;
  const startY = enterFrom === "up" ? -90 : 0;
  const breath =
    character === "bravo"
      ? 1 + Math.sin(frame / (fps * 0.9)) * 0.002
      : 1;
  const hover =
    character === "pipi"
      ? Math.sin(frame / (fps * 0.55)) * 3 +
        (speaking ? Math.sin(frame / 5) * 0.8 : 0)
      : 0;
  const bank =
    character === "pipi" && enterFrom !== "none"
      ? settle * (enterFrom === "left" ? 5 : -5)
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        transform: `translate(${startX * (1 - enter)}px, ${
          startY * (1 - enter) + hover
        }px) rotate(${bank}deg) scale(${flip ? -breath : breath}, ${breath})`,
        transformOrigin: character === "bravo" ? "50% 100%" : "50% 55%",
        opacity: enter,
        filter: "drop-shadow(0 18px 18px rgba(1,7,18,.34))",
      }}
    >
      <Img
        src={staticFile(`production/${asset}.png`)}
        style={{ width: "100%", display: "block" }}
      />
      {character === "pipi" && (
        <>
          <RotorDisc side="left" energy={speaking ? 1 : 0.72} />
          <RotorDisc side="right" energy={speaking ? 1 : 0.72} />
        </>
      )}
    </div>
  );
};

const RotorDisc: React.FC<{
  side: "left" | "right";
  energy: number;
}> = ({ side, energy }) => (
  <div
    style={{
      position: "absolute",
      left: side === "left" ? "10%" : "90%",
      top: "72%",
      width: "26%",
      height: `${3 + energy * 2}%`,
      borderRadius: "50%",
      background: "rgba(36,47,75,.42)",
      borderTop: "2px solid rgba(116,237,255,.36)",
      transform: "translate(-50%,-50%)",
      filter: "blur(1px)",
    }}
  />
);

export const BravoTalkingHead: React.FC<{
  width: number;
  x: number;
  y: number;
  localProgress: number;
  speaker: Speaker;
  expression?: "neutral" | "worried" | "amused" | "curious" | "surprised" | "teacher";
}> = ({
  width,
  x,
  y,
  localProgress,
  speaker,
  expression = "teacher",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const cue = cueAt(seconds);
  const talking = speaker === "BRAVO" && cue && cue.value !== "X";
  const viseme = talking ? rhubarbToBravo[cue.value] ?? "X" : null;
  const blink = frame % 137 >= 132;
  const enter = interpolate(localProgress, [0, 0.12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const nod = talking ? Math.sin(frame / 10) * 0.7 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: width * 1.12,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 35}px) rotate(${nod}deg)`,
        transformOrigin: "50% 90%",
        filter: "drop-shadow(0 18px 24px rgba(1,7,18,.36))",
      }}
    >
      <Img
        src={staticFile(`production/bravo-face-${expression}.png`)}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {viseme && (
        <Img
          src={staticFile(`production/bravo-viseme-${viseme}.png`)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            clipPath: "inset(54% 15% 5% 15%)",
          }}
        />
      )}
      {blink && (
        <div
          style={{
            position: "absolute",
            left: "28%",
            top: "42%",
            width: "44%",
            height: 6,
            borderRadius: 6,
            background: "#44281f",
            opacity: 0.76,
          }}
        />
      )}
    </div>
  );
};

const pipiMouth = (value: string | undefined) => {
  switch (value) {
    case "A":
    case "X":
      return { width: 28, height: 4, radius: 3 };
    case "B":
    case "G":
      return { width: 34, height: 8, radius: 5 };
    case "C":
    case "D":
      return { width: 48, height: 24, radius: 18 };
    case "E":
      return { width: 30, height: 34, radius: 18 };
    case "F":
      return { width: 24, height: 30, radius: 18 };
    case "H":
      return { width: 44, height: 14, radius: 10 };
    default:
      return { width: 34, height: 8, radius: 5 };
  }
};

export const PipiRig: React.FC<{
  width: number;
  x: number;
  y: number;
  localProgress: number;
  speaker: Speaker;
  emotion?: "neutral" | "alarm" | "suspicious" | "curious" | "laugh" | "focused";
  enterFrom?: "left" | "right" | "up" | "none";
}> = ({
  width,
  x,
  y,
  localProgress,
  speaker,
  emotion = "neutral",
  enterFrom = "none",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const cue = cueAt(seconds);
  const talking = speaker === "PIPI" && cue && cue.value !== "X";
  const mouth = pipiMouth(talking ? cue.value : "X");
  const enter =
    enterFrom === "none"
      ? 1
      : interpolate(localProgress, [0, 0.14], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
  const direction = enterFrom === "left" ? -1 : enterFrom === "right" ? 1 : 0;
  const hover = Math.sin(frame / 18) * 2.5;
  const bank = direction * (1 - enter) * -8;
  const eyeScale =
    emotion === "alarm" ? 1.18 : emotion === "laugh" ? 0.72 : 1;
  const laughBlink = emotion === "laugh" && frame % 90 < 22;
  const browRotate =
    emotion === "suspicious" ? -12 : emotion === "alarm" ? 10 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        aspectRatio: "255 / 190",
        opacity: enter,
        transform: `translate(${direction * (1 - enter) * 150}px, ${
          hover + (1 - enter) * -45
        }px) rotate(${bank}deg)`,
        transformOrigin: "50% 52%",
        filter: "drop-shadow(0 20px 20px rgba(1,7,18,.35))",
      }}
    >
      <Img
        src={staticFile("production/pipi-view-front.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "20%",
          width: "52%",
          height: "52%",
          borderRadius: "46% 46% 42% 42%",
          background: "#10121a",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "22%",
            top: "25%",
            width: "17%",
            height: `${25 * eyeScale}%`,
            borderRadius: "50%",
            background: "#37e5fa",
            transform: laughBlink ? "scaleY(.18)" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "22%",
            top: "25%",
            width: "17%",
            height: `${25 * eyeScale}%`,
            borderRadius: "50%",
            background: "#37e5fa",
            transform: laughBlink ? "scaleY(.18)" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "13%",
            width: "19%",
            height: 4,
            borderRadius: 4,
            background: "#37e5fa",
            transform: `rotate(${browRotate}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "20%",
            top: "13%",
            width: "19%",
            height: 4,
            borderRadius: 4,
            background: "#37e5fa",
            transform: `rotate(${-browRotate}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "70%",
            width: mouth.width,
            height: emotion === "laugh" && !talking ? 26 : mouth.height,
            borderRadius: mouth.radius,
            border: "4px solid #37e5fa",
            borderTop:
              emotion === "neutral" && !talking
                ? "none"
                : "4px solid #37e5fa",
            transform: "translate(-50%,-50%)",
            boxSizing: "border-box",
          }}
        />
      </div>
      <RotorDisc side="left" energy={talking ? 1 : 0.75} />
      <RotorDisc side="right" energy={talking ? 1 : 0.75} />
    </div>
  );
};
