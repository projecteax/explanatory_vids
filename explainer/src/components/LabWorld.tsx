import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export type CameraKey = {
  from: number;
  to: number;
  scaleFrom: number;
  scaleTo: number;
  xFrom?: number;
  xTo?: number;
  yFrom?: number;
  yTo?: number;
};

export const LabWorld: React.FC<{
  children?: React.ReactNode;
  camera: CameraKey;
  dim?: number;
  blur?: number;
}> = ({ children, camera, dim = 0, blur = 0 }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [camera.from, camera.to], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const scale = interpolate(
    progress,
    [0, 1],
    [camera.scaleFrom, camera.scaleTo],
  );
  const x = interpolate(progress, [0, 1], [
    camera.xFrom ?? 0,
    camera.xTo ?? 0,
  ]);
  const y = interpolate(progress, [0, 1], [
    camera.yFrom ?? 0,
    camera.yTo ?? 0,
  ]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#101b2c" }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: "50% 50%",
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      >
        <Img
          src={staticFile("art/lab.svg")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 51% 57%, rgba(75,229,255,.16), transparent 28%), linear-gradient(90deg, rgba(3,12,25,.28), transparent 45%, rgba(3,12,25,.18))",
          }}
        />
        {children}
      </AbsoluteFill>
      {dim > 0 && (
        <AbsoluteFill style={{ background: `rgba(3,10,22,${dim})` }} />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 170px rgba(0,0,0,.55)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export const LabMonitor: React.FC<{
  phase?: "full" | "crescent" | "ball";
  alert?: boolean;
}> = ({ phase = "full", alert = false }) => {
  const frame = useCurrentFrame();
  const pulse = 0.78 + Math.sin(frame / 5) * 0.22;
  return (
    <div
      style={{
        position: "absolute",
        left: 785,
        top: 535,
        width: 455,
        height: 126,
        transform: "perspective(900px) rotateX(-4deg)",
        background: alert
          ? `rgba(95,15,29,${0.55 + pulse * 0.15})`
          : "rgba(4,28,58,.87)",
        border: `3px solid ${alert ? "#ff5267" : "#54dcff"}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: alert
          ? "0 0 34px rgba(255,82,103,.55)"
          : "0 0 32px rgba(84,220,255,.42)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 12,
          color: alert ? "#ff8492" : "#76eaff",
          fontSize: 17,
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        {alert ? "MOON ALERT" : "LUNAR SCAN"}
      </div>
      <svg width="455" height="126" viewBox="0 0 455 126">
        <circle cx="226" cy="67" r="42" fill="#f2e3bd" />
        {phase === "crescent" && (
          <circle cx="245" cy="60" r="40" fill="#071b36" />
        )}
        {phase === "ball" && (
          <>
            <circle cx="211" cy="55" r="7" fill="#c9b68b" opacity=".55" />
            <circle cx="238" cy="79" r="10" fill="#c9b68b" opacity=".45" />
          </>
        )}
        <path
          d="M48 91 C100 70, 142 102, 187 82"
          fill="none"
          stroke={alert ? "#ff5267" : "#32d9ff"}
          strokeWidth="3"
          strokeDasharray="7 7"
          strokeDashoffset={-frame * 2}
        />
        <path
          d="M270 82 C320 57, 353 94, 418 64"
          fill="none"
          stroke={alert ? "#ff5267" : "#32d9ff"}
          strokeWidth="3"
          strokeDasharray="7 7"
          strokeDashoffset={frame * 2}
        />
      </svg>
    </div>
  );
};
