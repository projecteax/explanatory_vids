import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

export const PipiBot: React.FC<{ mood?: "worried" | "happy" | "laugh"; size?: number }> = ({
  mood = "happy",
  size = 160,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 10) * 8;
  const mouth =
    mood === "worried" ? "M55 95 Q80 80 105 95" : mood === "laugh" ? "M55 88 Q80 115 105 88" : "M58 92 Q80 108 102 92";

  return (
    <div style={{ width: size, height: size, transform: `translateY(${bob}px)` }}>
      <svg viewBox="0 0 160 160" width={size} height={size}>
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="rgba(0,0,0,0.25)" />
        <circle cx="40" cy="70" r="10" fill={colors.teal} opacity="0.85" />
        <circle cx="120" cy="70" r="10" fill={colors.teal} opacity="0.85" />
        <circle cx="80" cy="78" r="52" fill={colors.pipi} />
        <path d="M48 40 Q80 18 112 40" fill={colors.pipi} stroke="#D7DEE8" strokeWidth="4" />
        <rect x="48" y="62" width="64" height="34" rx="17" fill={colors.pipiVisor} />
        <circle cx="68" cy="79" r="6" fill={colors.pipiLed} />
        <circle cx="92" cy="79" r="6" fill={colors.pipiLed} />
        <path d={mouth} stroke="#94A3B8" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const BravoKid: React.FC<{ size?: number }> = ({ size = 170 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nod = spring({ frame: frame % (fps * 4), fps, config: { damping: 12 } });
  const tilt = interpolate(nod, [0, 1], [-2, 3]);

  return (
    <div style={{ width: size, height: size, transform: `rotate(${tilt}deg)` }}>
      <svg viewBox="0 0 170 170" width={size} height={size}>
        <ellipse cx="85" cy="158" rx="40" ry="7" fill="rgba(0,0,0,0.25)" />
        <circle cx="85" cy="78" r="46" fill={colors.bravoSkin} />
        <path
          d="M40 70 Q45 20 85 18 Q125 20 130 70 Q120 42 85 40 Q50 42 40 70Z"
          fill={colors.bravoHair}
        />
        <rect x="52" y="72" width="66" height="28" rx="6" fill="#1F2937" opacity="0.9" />
        <circle cx="68" cy="86" r="7" fill="#F8FBFF" />
        <circle cx="102" cy="86" r="7" fill="#F8FBFF" />
        <circle cx="68" cy="86" r="3.5" fill="#3B2F2F" />
        <circle cx="102" cy="86" r="3.5" fill="#3B2F2F" />
        <path d="M74 108 Q85 116 96 108" stroke="#B45309" strokeWidth="3" fill="none" />
        <rect x="55" y="124" width="60" height="34" rx="8" fill={colors.bravoVest} />
        <rect x="70" y="118" width="30" height="10" rx="3" fill="#F8FBFF" />
      </svg>
    </div>
  );
};

export const StageCard: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      borderRadius: 36,
      background: "linear-gradient(180deg, rgba(18,40,84,0.88), rgba(8,18,40,0.92))",
      border: `3px solid rgba(46,196,182,0.35)`,
      boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      overflow: "hidden",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);
