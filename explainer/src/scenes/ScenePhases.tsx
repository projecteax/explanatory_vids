import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number };

const PHASES = [
  { id: "new", label: "New", emoji: "sneaky" },
  { id: "crescent", label: "Crescent", emoji: "banana" },
  { id: "half", label: "Half", emoji: "half" },
  { id: "gibbous", label: "Gibbous", emoji: "bumpy" },
  { id: "full", label: "Full", emoji: "cookie" },
] as const;

function highlightIndex(n: number): number {
  if (n <= 14) return 1;
  if (n === 15) return 2;
  if (n === 16) return 4;
  return 3;
}

export const ScenePhases: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const hi = highlightIndex(line.n);
  const monthSpin = (frame / fps) * 60;

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill
          style={{
            padding: 36,
            opacity: interpolate(enter, [0, 1], [0, 1]),
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 900, textAlign: "center", color: colors.cream }}>
            Moon phase parade
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "0 20px" }}>
            {PHASES.map((p, i) => {
              const on = i === hi;
              const delay = i * 6;
              const local = spring({
                frame: Math.max(frame - delay, 0),
                fps,
                config: { damping: 12 },
              });
              return (
                <div
                  key={p.id}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    transform: `translateY(${interpolate(local, [0, 1], [30, 0])}px) scale(${on ? 1.12 : 1})`,
                    opacity: interpolate(local, [0, 1], [0, on ? 1 : 0.7]),
                    background: on ? "rgba(46,196,182,0.18)" : "transparent",
                    borderRadius: 24,
                    padding: 16,
                    border: on ? `3px solid ${colors.teal}` : "3px solid transparent",
                  }}
                >
                  <PhaseIcon kind={p.id} />
                  <div style={{ fontSize: 28, fontWeight: 900, marginTop: 10 }}>{p.label}</div>
                  <div style={{ fontSize: 20, color: colors.mute, fontWeight: 700 }}>{p.emoji}</div>
                </div>
              );
            })}
          </div>

          {line.n >= 16 && (
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 24,
              }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: `rotate(${monthSpin}deg)` }}>
                <circle cx="60" cy="60" r="44" fill="none" stroke={colors.teal} strokeWidth="8" strokeDasharray="40 20" />
                <circle cx="60" cy="16" r="10" fill={colors.moon} />
              </svg>
              <div style={{ fontSize: 36, fontWeight: 900, color: colors.cream }}>
                Whole show ≈ 1 month
                <div style={{ fontSize: 24, color: colors.mute, fontWeight: 700 }}>
                  Same Moon. Different sunny slice.
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      </StageCard>
    </AbsoluteFill>
  );
};

const PhaseIcon: React.FC<{ kind: string }> = ({ kind }) => (
  <svg width="110" height="110" viewBox="0 0 110 110">
    <circle cx="55" cy="55" r="42" fill={kind === "new" ? "#243044" : colors.moon} stroke={colors.cream} strokeWidth="3" />
    {kind === "new" && <circle cx="55" cy="55" r="42" fill="none" stroke={colors.mute} strokeDasharray="5 5" strokeWidth="3" />}
    {kind === "crescent" && <circle cx="72" cy="55" r="36" fill="#0B1B3A" />}
    {kind === "half" && <rect x="55" y="13" width="42" height="84" fill="#0B1B3A" />}
    {kind === "gibbous" && <circle cx="78" cy="55" r="28" fill="#0B1B3A" opacity="0.85" />}
  </svg>
);
