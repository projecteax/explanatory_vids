import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BravoVector } from "./BravoVector";
import { PipiVector } from "./PipiVector";
import { CameraPlate } from "./ProductionStage";

export const VectorRigTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speakingBravo = frame >= 75;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#1a2430" }}>
      <CameraPlate plate="production/plates/lab-blackboard-wall.png">
        <BravoVector
          x={70}
          y={318}
          width={390}
          pose={speakingBravo ? "point" : "idle"}
          mood={speakingBravo ? "teacher" : "curious"}
          speaking={speakingBravo}
          facing="screen"
          settle={1}
        />
        <PipiVector
          x={360}
          y={598}
          width={186}
          mood={speakingBravo ? "focused" : "alarm"}
          speaking={!speakingBravo}
          enter={1}
        />
      </CameraPlate>
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 36,
          color: "#F3EBD2",
          fontFamily: "Mikado",
          fontSize: 22,
          textShadow: "0 2px 0 #111",
        }}
      >
        QA {(frame / fps).toFixed(1)}s {speakingBravo ? "BRAVO" : "PIPI"}
      </div>
    </AbsoluteFill>
  );
};
