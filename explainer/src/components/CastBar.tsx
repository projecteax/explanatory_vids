import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BravoKid, PipiBot } from "./Characters";
import { colors } from "../theme";

export const CastBar: React.FC<{ speaker: string }> = ({ speaker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });

  const bravoOn = speaker === "BRAVO";
  const pipiOn = speaker === "PIPI";

  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        alignItems: "flex-end",
        marginTop: 18,
        marginBottom: 12,
        transform: `scale(${interpolate(pop, [0, 1], [0.96, 1])})`,
      }}
    >
      <div style={{ opacity: bravoOn ? 1 : 0.45, transform: bravoOn ? "translateY(-8px) scale(1.05)" : "none", transition: "none" }}>
        <BravoKid size={118} />
        <div style={{ textAlign: "center", fontWeight: 800, color: bravoOn ? colors.orange : colors.mute }}>
          Bravo
        </div>
      </div>
      <div style={{ opacity: pipiOn ? 1 : 0.45, transform: pipiOn ? "translateY(-8px) scale(1.05)" : "none" }}>
        <PipiBot size={110} mood={pipiOn ? "laugh" : "happy"} />
        <div style={{ textAlign: "center", fontWeight: 800, color: pipiOn ? colors.teal : colors.mute }}>
          Pipi
        </div>
      </div>
    </div>
  );
};
