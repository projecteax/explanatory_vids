import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Shot } from "./shotList";

export const CameraPlate: React.FC<{
  plate: string;
  children: React.ReactNode;
}> = ({ plate, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#1a2430" }}>
    <Img
      src={staticFile(plate)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
    {children}
  </AbsoluteFill>
);

export const Chalkboard: React.FC<{
  shot: Shot;
  title?: string;
  children: React.ReactNode;
}> = ({ shot, title, children }) => {
  if (shot === "bravoCu" || shot === "pipiCu") return null;

  const insert = shot === "board";
  const box = insert
    ? { left: 86, top: 48, width: 1748, height: 900 }
    : { left: 820, top: 118, width: 1000, height: 620 };

  return (
    <div
      style={{
        position: "absolute",
        ...box,
        zIndex: 18,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#6B4423",
          boxShadow: "0 16px 30px rgba(0,0,0,.32)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: insert ? 22 : 16,
          background:
            "radial-gradient(circle at 30% 20%, #2A4A36, #1B3326 58%, #14261C)",
          boxShadow: "inset 0 0 70px rgba(0,0,0,.28)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 7,
          height: insert ? 26 : 20,
          background: "#5A381C",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 36,
          bottom: 13,
          width: 54,
          height: 7,
          background: "#F3EEE0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 102,
          bottom: 13,
          width: 38,
          height: 7,
          background: "#E8D9A0",
        }}
      />
      {title ? (
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: insert ? 34 : 26,
            color: "#F3EBD2",
            fontFamily: "Mikado",
            fontSize: insert ? 40 : 30,
            letterSpacing: 1.1,
            textAlign: "center",
            textShadow: "0 1px 0 rgba(0,0,0,.35)",
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: title ? (insert ? 92 : 78) : 28,
          bottom: 40,
        }}
      >
        {children}
      </div>
    </div>
  );
};
