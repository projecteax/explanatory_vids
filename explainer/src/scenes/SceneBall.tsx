import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number };

export const SceneBall: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const spin = frame * 1.4;
  const squash = line.n === 5 ? 1 + Math.sin(frame / 4) * 0.04 : 1;

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            opacity: interpolate(enter, [0, 1], [0, 1]),
          }}
        >
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: colors.cream,
            }}
          >
            Secret #1 — The Moon is a BALL
          </div>
          <svg width="360" height="360" viewBox="0 0 360 360" style={{ transform: `scale(${squash}) rotate(${spin}deg)` }}>
            <defs>
              <radialGradient id="rock" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#F7E7C3" />
                <stop offset="100%" stopColor="#C2AE7E" />
              </radialGradient>
            </defs>
            <circle cx="180" cy="180" r="130" fill="url(#rock)" />
            <circle cx="130" cy="150" r="22" fill="#A89464" opacity="0.45" />
            <circle cx="210" cy="200" r="34" fill="#A89464" opacity="0.35" />
            <circle cx="200" cy="130" r="14" fill="#A89464" opacity="0.4" />
          </svg>
          <div style={{ display: "flex", gap: 18 }}>
            {["Does NOT shrink", "Does NOT melt", "Still a ball"].map((t, i) => (
              <div
                key={t}
                style={{
                  opacity: interpolate(frame, [20 + i * 12, 35 + i * 12], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  background: colors.teal,
                  color: colors.navyDeep,
                  fontWeight: 900,
                  fontSize: 28,
                  padding: "12px 20px",
                  borderRadius: 16,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </StageCard>
    </AbsoluteFill>
  );
};
