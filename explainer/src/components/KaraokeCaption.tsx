import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import timeline from "../timeline.json";

const lines = timeline.lines.slice(0, 4);

export const KaraokeCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const line =
    [...lines].reverse().find((candidate) => time >= candidate.start) ??
    lines[0];
  const spokenText = line.elevenlabs_text
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = spokenText.split(/\s+/);
  const lineProgress = interpolate(
    time,
    [line.start, line.end],
    [0, words.length],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 230,
        right: 230,
        bottom: 55,
        display: "flex",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        style={{
          maxWidth: 1380,
          padding: "19px 30px 22px",
          borderRadius: 22,
          background: "rgba(2,8,18,.84)",
          border: `2px solid ${
            line.speaker === "PIPI"
              ? "rgba(72,226,255,.72)"
              : "rgba(255,156,77,.72)"
          }`,
          boxShadow: "0 12px 34px rgba(0,0,0,.42)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: line.speaker === "PIPI" ? "#55e3ff" : "#ff9c4d",
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: 3,
            marginBottom: 7,
          }}
        >
          {line.speaker}
        </div>
        <div
          style={{
            color: "white",
            fontFamily: '"Nunito", "Segoe UI", sans-serif',
            fontWeight: 900,
            fontSize: 39,
            lineHeight: 1.18,
            textShadow: "0 3px 5px rgba(0,0,0,.7)",
          }}
        >
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              style={{
                color:
                  index < lineProgress
                    ? line.speaker === "PIPI"
                      ? "#64e8ff"
                      : "#ffad68"
                    : "#fff",
                display: "inline-block",
                transform:
                  index === Math.floor(lineProgress)
                    ? "translateY(-2px) scale(1.04)"
                    : "none",
                marginRight: 10,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
