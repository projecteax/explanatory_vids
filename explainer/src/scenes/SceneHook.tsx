import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number; text: string; speaker: string };

export const SceneHook: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });

  const fullScale = interpolate(frame, [0, 40], [1, 0.55], { extrapolateRight: "clamp" });
  const crescentOpacity = interpolate(frame, [25, 55], [0, 1], { extrapolateRight: "clamp" });
  const bite = line.n === 1;

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
            padding: 40,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
          }}
        >
          <MoonFace label="Last week" scale={fullScale} phase="full" />
          <div style={{ fontSize: 64, fontWeight: 900, color: colors.orange }}>→</div>
          <div style={{ opacity: crescentOpacity }}>
            <MoonFace label="Tonight" scale={1} phase="crescent" bitten={bite} />
          </div>
        </AbsoluteFill>
        {bite && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 36,
              transform: "translateX(-50%)",
              background: colors.orange,
              color: colors.navyDeep,
              fontWeight: 900,
              fontSize: 36,
              padding: "12px 28px",
              borderRadius: 999,
            }}
          >
            Someone eating it?!
          </div>
        )}
      </StageCard>
    </AbsoluteFill>
  );
};

const MoonFace: React.FC<{
  label: string;
  scale: number;
  phase: "full" | "crescent";
  bitten?: boolean;
}> = ({ label, scale, phase, bitten }) => (
  <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
    <div style={{ fontSize: 28, fontWeight: 800, color: colors.mute, marginBottom: 16 }}>{label}</div>
    <svg width="220" height="220" viewBox="0 0 220 220">
      <circle cx="110" cy="110" r="90" fill={colors.moon} />
      {phase === "crescent" && (
        <circle cx="145" cy="110" r="78" fill="#0B1B3A" />
      )}
      <circle cx="80" cy="90" r="10" fill="#C6B48A" opacity="0.55" />
      <circle cx="120" cy="130" r="16" fill="#C6B48A" opacity="0.45" />
      {bitten && (
        <text x="110" y="200" textAnchor="middle" fontSize="28" fill={colors.teal} fontWeight="800">
          tiny smile
        </text>
      )}
    </svg>
  </div>
);
