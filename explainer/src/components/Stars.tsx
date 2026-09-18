import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Stars: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = React.useMemo(() => {
    const out: { x: number; y: number; s: number; o: number }[] = [];
    for (let i = 0; i < 48; i++) {
      const seed = i * 9973;
      out.push({
        x: (seed % 1000) / 10,
        y: ((seed * 3) % 1000) / 10,
        s: 2 + (seed % 4),
        o: 0.25 + ((seed % 50) / 100),
      });
    }
    return out;
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {stars.map((star, i) => {
        const twinkle = 0.55 + 0.45 * Math.sin((frame + i * 7) / 18);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              borderRadius: "50%",
              background: "#F8FBFF",
              opacity: star.o * twinkle,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 80% 15%, rgba(255,201,74,0.12), transparent 28%)`,
          opacity: interpolate(frame, [0, 90], [0.4, 1], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};
