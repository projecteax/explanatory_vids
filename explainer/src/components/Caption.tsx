import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

export const Caption: React.FC<{ text: string; speaker: string; lineStart: number }> = ({
  text,
  speaker,
  lineStart,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(frame - Math.round(lineStart * fps), 0);
  const enter = spring({ frame: local, fps, config: { damping: 16, stiffness: 120 } });

  return (
    <div
      style={{
        minHeight: 110,
        borderRadius: 22,
        padding: "18px 28px",
        background: "rgba(7, 14, 30, 0.78)",
        border: `2px solid ${speaker === "PIPI" ? colors.teal : colors.orange}`,
        transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        opacity: interpolate(enter, [0, 1], [0, 1]),
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: speaker === "PIPI" ? colors.teal : colors.orange,
          marginBottom: 6,
        }}
      >
        {speaker}
      </div>
      <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.25, color: colors.ink }}>{text}</div>
    </div>
  );
};
