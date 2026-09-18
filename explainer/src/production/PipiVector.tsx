import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMouthCue } from "./MouthSource";

export type PipiMood =
  | "neutral"
  | "alarm"
  | "curious"
  | "laugh"
  | "focused"
  | "suspicious";

const Rotor: React.FC<{ x: number; y: number; spin: number; flip?: boolean }> = ({
  x,
  y,
  spin,
  flip,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <rect x="-54" y="-8" width="54" height="16" rx="8" fill="#2F3948" />
    <g transform={`translate(-62 10) rotate(${spin})`}>
      {[0, 120, 240].map((deg) => (
        <ellipse
          key={deg}
          rx="10"
          ry="26"
          fill="#2A3340"
          transform={`rotate(${deg}) translate(0 -20)`}
        />
      ))}
      <circle r="7" fill="#1A222C" />
      <circle r="3" fill="#8A97A3" />
    </g>
    <g transform="translate(-62 28)">
      <ellipse cx="0" cy="6" rx="20" ry="22" fill="#F2F5F7" />
      <ellipse cx="0" cy="6" rx="20" ry="22" fill="none" stroke="#C9D4DB" strokeWidth="3" />
      <rect x="-18" y="2" width="36" height="9" fill="#2FE6FB" />
      <ellipse cx="0" cy="22" rx="13" ry="7" fill="#1B2430" />
    </g>
  </g>
);

const VisorFace: React.FC<{
  mood: PipiMood;
  viseme: string;
  blink: boolean;
}> = ({ mood, viseme, blink }) => {
  const laugh = mood === "laugh";
  const alarm = mood === "alarm";
  const suspicious = mood === "suspicious";
  const eyeH = blink || laugh ? 4 : alarm ? 26 : 20;
  const eyeY = laugh ? 168 : 158;
  const brow = suspicious ? 10 : alarm ? -8 : laugh ? 6 : 0;

  let mouth: React.ReactNode;
  if (laugh && viseme === "X") {
    mouth = (
      <path
        d="M178 198 Q210 224 242 198"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="8"
        strokeLinecap="round"
      />
    );
  } else if (viseme === "D") {
    mouth = (
      <ellipse
        cx="210"
        cy="204"
        rx="18"
        ry="16"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7"
      />
    );
  } else if (viseme === "C") {
    mouth = (
      <ellipse
        cx="210"
        cy="202"
        rx="22"
        ry="12"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7"
      />
    );
  } else if (viseme === "E" || viseme === "F") {
    mouth = (
      <ellipse
        cx="210"
        cy="202"
        rx={viseme === "F" ? 8 : 11}
        ry={viseme === "F" ? 15 : 12}
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7"
      />
    );
  } else if (viseme === "A") {
    mouth = (
      <path
        d="M188 200 Q210 206 232 200"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7"
        strokeLinecap="round"
      />
    );
  } else if (viseme === "B" || viseme === "G" || viseme === "H") {
    mouth = (
      <path
        d="M186 198 Q210 214 234 198"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7.5"
        strokeLinecap="round"
      />
    );
  } else if (alarm) {
    mouth = (
      <ellipse
        cx="210"
        cy="204"
        rx="10"
        ry="11"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="7"
      />
    );
  } else if (suspicious) {
    mouth = (
      <path
        d="M190 202 Q210 206 230 202"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    );
  } else {
    mouth = (
      <path
        d="M182 198 Q210 218 238 198"
        fill="none"
        stroke="#2FE6FB"
        strokeWidth="8"
        strokeLinecap="round"
      />
    );
  }

  return (
    <g>
      <ellipse cx="210" cy="168" rx="86" ry="78" fill="#0A1018" />
      <ellipse
        cx="210"
        cy="168"
        rx="86"
        ry="78"
        fill="none"
        stroke="#6E818C"
        strokeWidth="6"
      />
      <clipPath id="pipi-visor">
        <ellipse cx="210" cy="168" rx="82" ry="74" />
      </clipPath>
      <g clipPath="url(#pipi-visor)">
        <ellipse cx="210" cy="168" rx="82" ry="74" fill="#0C121A" />
        {Array.from({ length: 18 }).map((_, i) => (
          <rect
            key={i}
            x="128"
            y={100 + i * 8}
            width="164"
            height="3"
            fill="#1A2A36"
            opacity=".35"
          />
        ))}
        <path
          d="M150 118 Q210 96 270 124"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
          opacity=".22"
        />
        <path
          d={`M168 ${132 + brow} Q182 ${124 + brow} 196 ${132 + brow}`}
          fill="none"
          stroke="#2FE6FB"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M224 ${132 + brow} Q238 ${124 + brow} 252 ${132 + brow}`}
          fill="none"
          stroke="#2FE6FB"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <ellipse cx="182" cy={eyeY} rx="14" ry={eyeH / 2} fill="#2FE6FB" />
        <ellipse cx="238" cy={eyeY} rx="14" ry={eyeH / 2} fill="#2FE6FB" />
        {!blink && !laugh && (
          <>
            <circle cx="178" cy={eyeY - 5} r="3.2" fill="#E7FFFF" />
            <circle cx="234" cy={eyeY - 5} r="3.2" fill="#E7FFFF" />
          </>
        )}
        {mouth}
      </g>
      <path
        d="M148 118 Q210 92 268 122"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
        opacity=".18"
        strokeLinecap="round"
      />
    </g>
  );
};

export const PipiVector: React.FC<{
  x: number;
  y: number;
  width?: number;
  mood?: PipiMood;
  speaking?: boolean;
  enter?: number;
}> = ({
  x,
  y,
  width = 360,
  mood = "neutral",
  speaking = false,
  enter = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const cue = useMouthCue(seconds);
  const viseme = speaking && cue ? cue.value : "X";
  const blink = frame % 110 > 104;
  const hover = Math.sin(frame / 24) * 2.2;
  const spin = frame * (speaking ? 22 : 14);
  const pop = mood === "laugh" ? Math.abs(Math.sin(frame / 9)) * 2 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: enter,
        transform: `translate(${(1 - enter) * 80}px, ${hover - pop}px)`,
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 420 320" width="100%" overflow="visible">
        <ellipse cx="210" cy="302" rx="70" ry="10" fill="rgba(0,0,0,.2)" />

        <path
          d="M132 118 C118 36 148 18 176 78 C158 98 146 118 140 142 Z"
          fill="#F4F6F8"
          stroke="#D5DFE3"
          strokeWidth="3"
        />
        <path
          d="M288 118 C302 36 272 18 244 78 C262 98 274 118 280 142 Z"
          fill="#F4F6F8"
          stroke="#D5DFE3"
          strokeWidth="3"
        />

        <Rotor x={92} y={196} spin={spin} />
        <Rotor x={328} y={196} spin={-spin} flip />

        <ellipse
          cx="210"
          cy="168"
          rx="112"
          ry="108"
          fill="#F4F6F8"
          stroke="#D3DDE1"
          strokeWidth="4"
        />
        <ellipse cx="176" cy="132" rx="38" ry="28" fill="#FFFFFF" opacity=".55" />
        <path
          d="M268 86 C304 118 308 176 286 214"
          fill="none"
          stroke="#2FE6FB"
          strokeWidth="6"
          strokeLinecap="round"
          opacity=".8"
        />

        <circle cx="108" cy="168" r="26" fill="#E6ECF0" />
        <circle cx="108" cy="168" r="18" fill="none" stroke="#2FE6FB" strokeWidth="5" />
        <circle cx="312" cy="168" r="26" fill="#E6ECF0" />
        <circle cx="312" cy="168" r="18" fill="none" stroke="#2FE6FB" strokeWidth="5" />

        <VisorFace mood={mood} viseme={viseme} blink={blink} />

        <rect x="198" y="248" width="24" height="8" rx="4" fill="#495760" />
      </svg>
    </div>
  );
};
