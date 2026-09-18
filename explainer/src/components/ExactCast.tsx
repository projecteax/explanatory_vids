import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const PipiExact: React.FC<{
  width?: number;
  talking?: boolean;
  emotion?: "alarm" | "curious" | "excited";
  entrance?: number;
}> = ({
  width = 430,
  talking = false,
  emotion = "curious",
  entrance = 0,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + 8) / 8) * (emotion === "excited" ? 12 : 6);
  const chatter = talking ? Math.sin(frame * 1.45) * 2.2 : 0;
  const inProgress = interpolate(frame, [entrance, entrance + 18], [0, 1], clamp);
  const shake =
    emotion === "alarm"
      ? Math.sin(frame * 1.8) * interpolate(frame, [0, 80], [7, 1.5], clamp)
      : 0;
  const spin = frame * 34;

  return (
    <div
      style={{
        position: "relative",
        width,
        aspectRatio: "1024 / 682",
        transform: `translateY(${bob + chatter}px) translateX(${interpolate(
          inProgress,
          [0, 1],
          [180, 0],
        )}px) rotate(${shake}deg)`,
        opacity: inProgress,
        filter: "drop-shadow(0 24px 24px rgba(0,0,0,.38))",
        transformOrigin: "50% 52%",
      }}
    >
      <Img
        src={staticFile("art/pipi.svg")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      {/* Rotor-speed accents retain the supplied silhouette while selling flight. */}
      {[{ left: "13%", top: "61%" }, { left: "82%", top: "60%" }].map(
        (p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.left,
              top: p.top,
              width: "19%",
              height: 4,
              borderRadius: 20,
              background:
                "linear-gradient(90deg, transparent, rgba(98,235,255,.9), transparent)",
              transform: `translate(-50%,-50%) rotate(${spin * (i ? -1 : 1)}deg)`,
              opacity: 0.8,
            }}
          />
        ),
      )}

      {emotion === "alarm" && (
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "50%",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#ff4d5e",
            boxShadow: `0 0 ${22 + 12 * Math.abs(Math.sin(frame / 4))}px #ff4d5e`,
            opacity: 0.75 + 0.25 * Math.sin(frame / 3),
          }}
        />
      )}
    </div>
  );
};

/**
 * The supplied Bravo reference is a T-pose. The same traced image is clipped
 * into rig layers and its arms are rotated at the shoulder pivots, preserving
 * the exact supplied face/clothes while producing a usable acting pose.
 */
export const BravoExact: React.FC<{
  width?: number;
  talking?: boolean;
  gesture?: "calm" | "explain" | "point";
}> = ({ width = 440, talking = false, gesture = "calm" }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 17) * 0.006;
  const talkNod = talking ? Math.sin(frame / 7) * 1.2 : 0;
  const rightGesture =
    gesture === "point"
      ? 18 + Math.sin(frame / 14) * 3
      : gesture === "explain"
        ? 52 + Math.sin(frame / 18) * 3
        : 68;
  const leftGesture =
    gesture === "explain" ? -48 - Math.sin(frame / 19) * 3 : -68;

  const layer: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        aspectRatio: "965 / 941",
        transform: `scale(${breathe}) rotate(${talkNod}deg)`,
        transformOrigin: "50% 82%",
        filter: "drop-shadow(0 28px 28px rgba(0,0,0,.38))",
      }}
    >
      <Img
        src={staticFile("art/bravo.svg")}
        style={{ ...layer, clipPath: "inset(0 28% 59% 28%)" }}
      />
      <Img
        src={staticFile("art/bravo.svg")}
        style={{
          ...layer,
          clipPath: "inset(34% 31% 0 31%)",
        }}
      />
      <Img
        src={staticFile("art/bravo.svg")}
        style={{
          ...layer,
          clipPath: "polygon(0 35%, 42% 35%, 42% 48%, 0 48%)",
          transform: `rotate(${leftGesture}deg)`,
          transformOrigin: "39% 40%",
        }}
      />
      <Img
        src={staticFile("art/bravo.svg")}
        style={{
          ...layer,
          clipPath: "polygon(58% 35%, 100% 35%, 100% 48%, 58% 48%)",
          transform: `rotate(${rightGesture}deg)`,
          transformOrigin: "61% 40%",
        }}
      />
    </div>
  );
};
