import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import timeline from "./timeline.json";
import { colors, font } from "./theme";
import { CastBar } from "./components/CastBar";
import { Caption } from "./components/Caption";
import { Stars } from "./components/Stars";
import { SceneHook } from "./scenes/SceneHook";
import { SceneBall } from "./scenes/SceneBall";
import { SceneSunlight } from "./scenes/SceneSunlight";
import { SceneOrbit } from "./scenes/SceneOrbit";
import { ScenePhases } from "./scenes/ScenePhases";
import { SceneWrap } from "./scenes/SceneWrap";

type Line = (typeof timeline.lines)[number];

function activeLine(frame: number, fps: number): Line {
  const t = frame / fps;
  let current = timeline.lines[0];
  for (const line of timeline.lines) {
    if (t >= line.start) current = line;
  }
  return current;
}

function sceneFor(line: Line): React.ComponentType<{ line: any }> {
  switch (line.scene) {
    case "01":
      return SceneHook;
    case "02":
      return line.n <= 5 ? SceneBall : SceneSunlight;
    case "03":
      return SceneOrbit;
    case "04":
      return ScenePhases;
    default:
      return SceneWrap;
  }
}

export const MoonExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = activeLine(frame, fps);

  const titleIn = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const bgShift = interpolate(frame, [0, fps * 180], [0, 40], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 30% ${20 + bgShift}%, #14305F 0%, ${colors.navy} 42%, ${colors.navyDeep} 100%)`,
        fontFamily: font,
        color: colors.ink,
        overflow: "hidden",
      }}
    >
      <Stars />

      <AbsoluteFill style={{ padding: 56, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            opacity: interpolate(titleIn, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleIn, [0, 1], [-18, 0])}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 28,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: colors.teal,
                fontWeight: 800,
              }}
            >
              Widgeteers Explains
            </div>
            <div style={{ fontSize: 54, fontWeight: 900, marginTop: 6 }}>
              Why Does the Moon Change Shape?
            </div>
          </div>
          <div
            style={{
              background: colors.card,
              border: `2px solid ${colors.tealDim}`,
              borderRadius: 18,
              padding: "14px 22px",
              fontSize: 24,
              fontWeight: 700,
              color: colors.cream,
            }}
          >
            ages 6–7
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", minHeight: 520 }}>
          {timeline.lines.map((l) => {
            const from = Math.round(l.start * fps);
            const untilNext =
              l.n < timeline.lines.length
                ? timeline.lines[l.n].start
                : timeline.duration_seconds;
            const duration = Math.max(Math.round((untilNext - l.start) * fps), 1);
            const Comp = sceneFor(l);
            return (
              <Sequence key={l.n} from={from} durationInFrames={duration} layout="none">
                <Comp line={l} />
              </Sequence>
            );
          })}
        </div>

        <div style={{ flexShrink: 0 }}>
          <CastBar speaker={line.speaker} />
          <Caption text={line.text} speaker={line.speaker} lineStart={line.start} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
