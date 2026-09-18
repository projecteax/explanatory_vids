import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { BravoExact, PipiExact } from "./components/ExactCast";
import { KaraokeCaption } from "./components/KaraokeCaption";
import { LabMonitor, LabWorld } from "./components/LabWorld";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const fadeEdges = (frame: number, duration: number) =>
  interpolate(frame, [0, 5, duration - 5, duration], [0, 1, 1, 0], clamp);

const Shot: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: fadeEdges(frame, duration) }}>
      {children}
    </AbsoluteFill>
  );
};

const PipiPosition: React.FC<{
  left: number;
  top: number;
  width: number;
  emotion?: "alarm" | "curious" | "excited";
  talking?: boolean;
  entrance?: number;
}> = (props) => (
  <div style={{ position: "absolute", left: props.left, top: props.top }}>
    <PipiExact
      width={props.width}
      emotion={props.emotion}
      talking={props.talking}
      entrance={props.entrance}
    />
  </div>
);

const BravoPosition: React.FC<{
  left: number;
  top: number;
  width: number;
  talking?: boolean;
  gesture?: "calm" | "explain" | "point";
}> = (props) => (
  <div style={{ position: "absolute", left: props.left, top: props.top }}>
    <BravoExact
      width={props.width}
      talking={props.talking}
      gesture={props.gesture}
    />
  </div>
);

const AlarmGraphics: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = interpolate(frame % 24, [0, 24], [0.45, 1.25]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1120,
          top: 240,
          width: 430,
          height: 430,
          borderRadius: "50%",
          border: "8px solid rgba(255,76,96,.8)",
          transform: `scale(${ring})`,
          opacity: 1.2 - ring,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 95,
          padding: "16px 25px",
          background: "#e63f55",
          color: "white",
          borderRadius: 14,
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 1000,
          fontSize: 32,
          letterSpacing: 3,
          transform: `rotate(-2deg) scale(${1 + Math.sin(frame / 3) * 0.025})`,
          boxShadow: "0 10px 30px rgba(230,63,85,.45)",
        }}
      >
        MOON EMERGENCY!
      </div>
    </>
  );
};

const SplitMoonEvidence: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [8, 45], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 225,
        top: 170,
        display: "flex",
        gap: 80,
        alignItems: "center",
        transform: `scale(${reveal})`,
      }}
    >
      <EvidenceMoon phase="full" label="LAST WEEK" />
      <div style={{ color: "#ff6678", fontSize: 80, fontWeight: 1000 }}>→</div>
      <EvidenceMoon phase="crescent" label="TONIGHT" />
    </div>
  );
};

const EvidenceMoon: React.FC<{
  phase: "full" | "crescent";
  label: string;
}> = ({ phase, label }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        color: phase === "full" ? "#81ebff" : "#ff7788",
        fontSize: 25,
        fontWeight: 1000,
        letterSpacing: 3,
        marginBottom: 16,
      }}
    >
      {label}
    </div>
    <svg width="230" height="230" viewBox="0 0 230 230">
      <circle
        cx="115"
        cy="115"
        r="92"
        fill="#f4e4bd"
        stroke="white"
        strokeWidth="5"
      />
      {phase === "crescent" && (
        <circle cx="154" cy="94" r="88" fill="#071326" />
      )}
      <circle cx="83" cy="92" r="12" fill="#c7b484" opacity=".48" />
      <circle cx="125" cy="143" r="18" fill="#c7b484" opacity=".38" />
    </svg>
  </div>
);

const ScienceSnack: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [8, 23], [0.5, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.8)),
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 105,
        top: 90,
        padding: "18px 30px",
        borderRadius: 20,
        background: "#ffb247",
        color: "#172039",
        fontFamily: '"Nunito", sans-serif',
        fontSize: 42,
        lineHeight: 1,
        fontWeight: 1000,
        transform: `rotate(-5deg) scale(${pop})`,
        boxShadow: "0 14px 0 #d97924, 0 24px 45px rgba(0,0,0,.3)",
      }}
    >
      SCIENCE
      <br />
      SNACK!
    </div>
  );
};

const MoonBallLesson: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [0, 30], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const turn = frame * 1.3;
  return (
    <div
      style={{
        position: "absolute",
        left: 630,
        top: 155,
        width: 1040,
        height: 660,
        borderRadius: 34,
        background:
          "linear-gradient(145deg, rgba(6,25,55,.96), rgba(12,62,92,.94))",
        border: "4px solid #52dcff",
        boxShadow:
          "0 0 55px rgba(50,217,255,.45), 0 30px 80px rgba(0,0,0,.5)",
        transform: `translateY(${interpolate(reveal, [0, 1], [85, 0])}px) scale(${interpolate(reveal, [0, 1], [0.86, 1])})`,
        opacity: reveal,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#64e8ff",
          fontFamily: '"Nunito", sans-serif',
          fontWeight: 1000,
          fontSize: 37,
          letterSpacing: 2,
        }}
      >
        SECRET #1 — THE MOON IS A BALL
      </div>
      <svg width="1040" height="660" viewBox="0 0 1040 660">
        <defs>
          <radialGradient id="moon3d" cx="34%" cy="28%">
            <stop offset="0%" stopColor="#fff4d4" />
            <stop offset="65%" stopColor="#e0ca98" />
            <stop offset="100%" stopColor="#927c55" />
          </radialGradient>
        </defs>
        <g transform={`translate(520 350) rotate(${turn})`}>
          <circle r="185" fill="url(#moon3d)" />
          <ellipse
            cx="-58"
            cy="-40"
            rx="30"
            ry="20"
            fill="#ad9769"
            opacity=".42"
          />
          <circle cx="55" cy="65" r="38" fill="#ad9769" opacity=".35" />
          <circle cx="76" cy="-73" r="20" fill="#ad9769" opacity=".38" />
        </g>
        <ellipse
          cx="520"
          cy="558"
          rx="220"
          ry="28"
          fill="rgba(1,7,18,.38)"
        />
        <path
          d="M230 350 C280 190 360 130 455 112"
          fill="none"
          stroke="#54e5ff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="440"
          strokeDashoffset={440 * (1 - reveal)}
        />
        <polygon points="456,112 426,110 446,137" fill="#54e5ff" />
        <text
          x="175"
          y="380"
          fill="white"
          fontFamily="Nunito"
          fontSize="34"
          fontWeight="900"
        >
          GIANT ROCKY BALL
        </text>
      </svg>
    </div>
  );
};

export const MoonExplainer30: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = [75, 190, 326, 350, 500, 618, 747].some(
    (cut) => Math.abs(frame - cut) < 3,
  );

  return (
    <AbsoluteFill style={{ background: "#071326", overflow: "hidden" }}>
      {/* 0–2.5s: establish geography and bring Pipi into the lab. */}
      <Sequence from={0} durationInFrames={75}>
        <Shot duration={75}>
          <LabWorld
            camera={{
              from: 0,
              to: 74,
              scaleFrom: 1,
              scaleTo: 1.13,
              xFrom: 0,
              xTo: -55,
              yFrom: 0,
              yTo: 18,
            }}
          >
            <LabMonitor phase="full" />
            <PipiPosition
              left={1270}
              top={315}
              width={470}
              emotion="alarm"
              talking
              entrance={5}
            />
          </LabWorld>
          <AlarmGraphics />
        </Shot>
      </Sequence>

      {/* 2.5–6.3s: Pipi presents visual evidence, still inside the lab. */}
      <Sequence from={75} durationInFrames={115}>
        <Shot duration={115}>
          <LabWorld
            dim={0.18}
            camera={{
              from: 0,
              to: 114,
              scaleFrom: 1.14,
              scaleTo: 1.3,
              xFrom: -70,
              xTo: -155,
              yFrom: 15,
              yTo: 40,
            }}
          >
            <LabMonitor phase="crescent" alert />
            <PipiPosition
              left={1260}
              top={325}
              width={420}
              emotion="alarm"
              talking
            />
          </LabWorld>
          <SplitMoonEvidence />
        </Shot>
      </Sequence>

      {/* 6.3–10.9s: dramatic reaction close-up. */}
      <Sequence from={190} durationInFrames={136}>
        <Shot duration={136}>
          <LabWorld
            dim={0.28}
            blur={2}
            camera={{
              from: 0,
              to: 135,
              scaleFrom: 1.55,
              scaleTo: 1.75,
              xFrom: -480,
              xTo: -620,
              yFrom: 110,
              yTo: 135,
            }}
          >
            <LabMonitor phase="crescent" alert />
          </LabWorld>
          <div
            style={{
              position: "absolute",
              left: 670,
              top: 205,
              transform: "scale(1.48)",
            }}
          >
            <PipiExact width={560} emotion="alarm" talking />
          </div>
          <div
            style={{
              position: "absolute",
              top: 92,
              right: 110,
              color: "#ff6b7d",
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 1000,
              fontSize: 54,
              transform: `rotate(${Math.sin(frame / 4) * 2}deg)`,
            }}
          >
            SOMEONE IS EATING IT?!
          </div>
        </Shot>
      </Sequence>

      {/* Pause beat: reveal Bravo in a composed two-shot. */}
      <Sequence from={326} durationInFrames={24}>
        <Shot duration={24}>
          <LabWorld
            camera={{
              from: 0,
              to: 23,
              scaleFrom: 1.32,
              scaleTo: 1.23,
              xFrom: 80,
              xTo: 30,
              yFrom: 20,
              yTo: 10,
            }}
          >
            <LabMonitor phase="crescent" />
            <BravoPosition
              left={260}
              top={280}
              width={450}
              gesture="calm"
            />
            <PipiPosition
              left={1220}
              top={340}
              width={400}
              emotion="curious"
            />
          </LabWorld>
        </Shot>
      </Sequence>

      {/* 11.65–16.7s: Bravo's reassuring medium shot. */}
      <Sequence from={350} durationInFrames={150}>
        <Shot duration={150}>
          <LabWorld
            camera={{
              from: 0,
              to: 149,
              scaleFrom: 1.27,
              scaleTo: 1.48,
              xFrom: 330,
              xTo: 470,
              yFrom: 95,
              yTo: 125,
            }}
          >
            <LabMonitor phase="crescent" />
            <BravoPosition
              left={285}
              top={280}
              width={470}
              talking
              gesture="explain"
            />
            <PipiPosition
              left={1170}
              top={360}
              width={340}
              emotion="curious"
            />
          </LabWorld>
        </Shot>
      </Sequence>

      {/* 16.7–20.6s: motivated rack toward the Moon screen. */}
      <Sequence from={500} durationInFrames={118}>
        <Shot duration={118}>
          <LabWorld
            camera={{
              from: 0,
              to: 117,
              scaleFrom: 1.3,
              scaleTo: 1.82,
              xFrom: 10,
              xTo: -45,
              yFrom: 20,
              yTo: 155,
            }}
          >
            <LabMonitor phase="crescent" />
            <BravoPosition
              left={260}
              top={300}
              width={425}
              talking
              gesture="point"
            />
            <PipiPosition
              left={1210}
              top={350}
              width={350}
              emotion="curious"
            />
          </LabWorld>
          <div
            style={{
              position: "absolute",
              left: 535,
              top: 90,
              color: "white",
              fontFamily: '"Nunito", sans-serif',
              fontWeight: 1000,
              fontSize: 48,
              textShadow: "0 6px 18px rgba(0,0,0,.75)",
            }}
          >
            Different shape… same Moon.
          </div>
        </Shot>
      </Sequence>

      {/* 20.6–24.9s: Pipi's comedic energy beat. */}
      <Sequence from={618} durationInFrames={129}>
        <Shot duration={129}>
          <LabWorld
            dim={0.16}
            camera={{
              from: 0,
              to: 128,
              scaleFrom: 1.35,
              scaleTo: 1.58,
              xFrom: -280,
              xTo: -420,
              yFrom: 70,
              yTo: 110,
            }}
          >
            <LabMonitor phase="ball" />
          </LabWorld>
          <div style={{ position: "absolute", left: 745, top: 210 }}>
            <PipiExact width={670} emotion="excited" talking />
          </div>
          <ScienceSnack />
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 1070 + Math.cos(i) * (220 + (frame % 20) * 3),
                top: 460 + Math.sin(i * 1.7) * (150 + (frame % 20) * 2),
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: i % 2 ? "#ffb247" : "#50e4ff",
                opacity: 0.8,
              }}
            />
          ))}
        </Shot>
      </Sequence>

      {/* 24.9–30s: the monitor becomes the educational stage. */}
      <Sequence from={747} durationInFrames={153}>
        <Shot duration={153}>
          <LabWorld
            dim={0.42}
            camera={{
              from: 0,
              to: 152,
              scaleFrom: 1.05,
              scaleTo: 1.13,
              xFrom: 0,
              xTo: -35,
              yFrom: 0,
              yTo: 10,
            }}
          >
            <BravoPosition
              left={130}
              top={315}
              width={430}
              talking
              gesture="point"
            />
          </LabWorld>
          <MoonBallLesson />
        </Shot>
      </Sequence>

      <KaraokeCaption />
      {flash && (
        <AbsoluteFill
          style={{
            zIndex: 500,
            background: "rgba(115,231,255,.16)",
            mixBlendMode: "screen",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
