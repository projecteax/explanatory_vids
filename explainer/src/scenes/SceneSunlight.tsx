import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number };

export const SceneSunlight: React.FC<{ line: Line }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const beam = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            opacity: interpolate(enter, [0, 1], [0, 1]),
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: colors.sun, marginBottom: 16 }}>SUN</div>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="48" fill={colors.sun} />
              {Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const x1 = 90 + Math.cos(a) * 58;
                const y1 = 90 + Math.sin(a) * 58;
                const x2 = 90 + Math.cos(a) * 78;
                const y2 = 90 + Math.sin(a) * 78;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={colors.sun}
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                );
              })}
            </svg>
          </div>

          <svg width="220" height="40" viewBox="0 0 220 40" style={{ opacity: beam }}>
            <defs>
              <linearGradient id="beam" x1="0" x2="1">
                <stop offset="0%" stopColor={colors.sun} stopOpacity="0.9" />
                <stop offset="100%" stopColor={colors.sun} stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect x="0" y="12" width="220" height="16" fill="url(#beam)" rx="8" />
          </svg>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: colors.cream, marginBottom: 16 }}>MOON</div>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <defs>
                <clipPath id="moonClip">
                  <circle cx="110" cy="110" r="90" />
                </clipPath>
              </defs>
              <circle cx="110" cy="110" r="90" fill="#3A4660" />
              <g clipPath="url(#moonClip)">
                <rect
                  x="0"
                  y="0"
                  width={interpolate(beam, [0, 1], [0, 110])}
                  height="220"
                  fill={colors.moon}
                />
              </g>
              <text x="55" y="205" textAnchor="middle" fill={colors.sun} fontSize="22" fontWeight="800">
                sunny
              </text>
              <text x="165" y="205" textAnchor="middle" fill={colors.mute} fontSize="22" fontWeight="800">
                sleepy
              </text>
            </svg>
          </div>
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 900,
            color: colors.cream,
          }}
        >
          Secret #2 — The Sun paints the Moon
        </div>
      </StageCard>
    </AbsoluteFill>
  );
};
