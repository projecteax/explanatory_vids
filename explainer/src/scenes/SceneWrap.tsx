import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number };

export const SceneWrap: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const skinny = interpolate(Math.sin(frame / 14), [-1, 1], [0.35, 1]);

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            padding: 40,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 900, color: colors.cream, textAlign: "center" }}>
            It did NOT shrink
          </div>
          <svg width="260" height="260" viewBox="0 0 260 260">
            <defs>
              <clipPath id="skinny">
                <ellipse cx="130" cy="130" rx={90 * skinny} ry="90" />
              </clipPath>
            </defs>
            <circle cx="130" cy="130" r="90" fill="#243044" stroke={colors.mute} strokeDasharray="6 6" strokeWidth="3" />
            <circle cx="130" cy="130" r="90" fill={colors.moon} clipPath="url(#skinny)" />
          </svg>
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: colors.teal,
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            You are just seeing a different piece of sunlight.
          </div>
          {line.n >= 19 && (
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 8,
              }}
            >
              {["banana", "half", "cookie"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    opacity: interpolate(frame, [15 + i * 10, 28 + i * 10], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    background: i === 2 ? colors.orange : colors.teal,
                    color: colors.navyDeep,
                    fontWeight: 900,
                    fontSize: 32,
                    padding: "14px 26px",
                    borderRadius: 18,
                    textTransform: "uppercase",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
          {line.n === 20 && (
            <div
              style={{
                marginTop: 12,
                fontSize: 40,
                fontWeight: 900,
                color: colors.cream,
              }}
            >
              Widgeteers Explains — mystery solved
            </div>
          )}
        </AbsoluteFill>
      </StageCard>
    </AbsoluteFill>
  );
};
