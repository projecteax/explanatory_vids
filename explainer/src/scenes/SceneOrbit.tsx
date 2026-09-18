import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StageCard } from "../components/Characters";
import { colors } from "../theme";

type Line = { n: number; text: string };

const phaseFor = (n: number): "new" | "crescent" | "half" | "gibbous" | "full" => {
  if (n >= 11) return "new";
  if (n >= 9) return "full";
  return "half";
};

export const SceneOrbit: React.FC<{ line: Line }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const angle = (frame / fps) * 40;
  const rad = (angle * Math.PI) / 180;
  const moonX = 280 + Math.cos(rad) * 170;
  const moonY = 220 + Math.sin(rad) * 110;
  const phase = phaseFor(line.n);
  const cookiePop = line.n === 10 ? spring({ frame, fps, config: { damping: 10 } }) : 0;

  return (
    <AbsoluteFill>
      <StageCard>
        <AbsoluteFill style={{ opacity: interpolate(enter, [0, 1], [0, 1]) }}>
          <div
            style={{
              position: "absolute",
              top: 24,
              width: "100%",
              textAlign: "center",
              fontSize: 40,
              fontWeight: 900,
              color: colors.cream,
            }}
          >
            Earth view changes as the Moon orbits
          </div>

          <svg width="100%" height="100%" viewBox="0 0 900 520">
            <circle cx="70" cy="220" r="48" fill={colors.sun} />
            <ellipse
              cx="280"
              cy="220"
              rx="170"
              ry="110"
              fill="none"
              stroke="rgba(248,251,255,0.25)"
              strokeWidth="3"
              strokeDasharray="10 10"
            />
            <circle cx="280" cy="220" r="48" fill="#3DDC97" />
            <circle cx="280" cy="220" r="48" fill="#2A9D8F" opacity="0.35" />
            <text x="280" y="226" textAnchor="middle" fill={colors.navyDeep} fontSize="22" fontWeight="800">
              Earth
            </text>
            <MoonAt x={moonX} y={moonY} phase={phase} />
            <text x="70" y="300" textAnchor="middle" fill={colors.sun} fontSize="24" fontWeight="800">
              Sun
            </text>
          </svg>

          <div
            style={{
              position: "absolute",
              right: 40,
              top: 120,
              width: 260,
              background: colors.card,
              borderRadius: 24,
              border: `2px solid ${colors.teal}`,
              padding: 20,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, color: colors.mute, fontWeight: 700 }}>You see</div>
            <BigPhase phase={phase} />
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8, color: colors.cream }}>
              {phase === "full" ? "FULL MOON" : phase === "new" ? "NEW MOON" : "changing view"}
            </div>
            {line.n === 10 && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 28,
                  fontWeight: 900,
                  color: colors.orange,
                  transform: `scale(${interpolate(cookiePop, [0, 1], [0.6, 1])})`,
                }}
              >
                Big cookie!
              </div>
            )}
          </div>
        </AbsoluteFill>
      </StageCard>
    </AbsoluteFill>
  );
};

const MoonAt: React.FC<{ x: number; y: number; phase: string }> = ({ x, y, phase }) => (
  <g transform={`translate(${x - 28}, ${y - 28})`}>
    <circle cx="28" cy="28" r="28" fill={phase === "new" ? "#2A3348" : colors.moon} stroke={colors.cream} strokeWidth="2" />
    {phase === "half" && <rect x="28" y="0" width="28" height="56" fill="#0B1B3A" opacity="0.85" />}
    {phase === "crescent" && <circle cx="40" cy="28" r="24" fill="#0B1B3A" />}
  </g>
);

const BigPhase: React.FC<{ phase: string }> = ({ phase }) => (
  <svg width="140" height="140" viewBox="0 0 140 140" style={{ margin: "8px auto" }}>
    <circle cx="70" cy="70" r="54" fill={phase === "new" ? "#243044" : colors.moon} stroke={colors.cream} strokeWidth="3" />
    {phase === "new" && <circle cx="70" cy="70" r="54" fill="none" stroke={colors.mute} strokeWidth="3" strokeDasharray="6 6" />}
    {phase === "half" && <rect x="70" y="16" width="54" height="108" fill="#0B1B3A" />}
  </svg>
);
