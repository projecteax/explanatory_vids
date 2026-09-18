import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import wordTimings from "../production-data/word-timings.json";

const MAX_WORDS = 8;

const outline =
  "-2px -2px 0 #141414, 2px -2px 0 #141414, -2px 2px 0 #141414, 2px 2px 0 #141414, 0 3px 8px rgba(0,0,0,.55)";

export const ProductionCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const line = wordTimings.find(
    (candidate) => time >= candidate.start && time <= candidate.end,
  );
  if (!line) return null;

  let activeIndex = line.words.findIndex(
    (word) => time >= word.start && time < word.end,
  );
  if (activeIndex < 0) {
    activeIndex = line.words.filter((word) => word.start <= time).length - 1;
  }
  const chunkIndex = Math.max(0, Math.floor(activeIndex / MAX_WORDS));
  const chunkStart = chunkIndex * MAX_WORDS;
  const words = line.words.slice(chunkStart, chunkStart + MAX_WORDS);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 200,
        left: 80,
        right: 80,
        bottom: 38,
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: "Mikado",
          fontSize: 46,
          lineHeight: 1.16,
          textShadow: outline,
        }}
      >
        {words.map((word, index) => {
          const absoluteIndex = chunkStart + index;
          const spoken = absoluteIndex <= activeIndex;
          const current = absoluteIndex === activeIndex;
          return (
            <span
              key={`${word.word}-${absoluteIndex}`}
              style={{
                display: "inline-block",
                marginRight: 11,
                color: spoken
                  ? line.speaker === "PIPI"
                    ? "#D8FBFF"
                    : "#FFE7C4"
                  : "#F7F3EA",
                opacity: spoken ? 1 : 0.72,
                transform: current ? "translateY(-1px)" : "none",
              }}
            >
              {word.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
