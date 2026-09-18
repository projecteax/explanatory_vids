import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useMouthCue } from "./MouthSource";

export type BravoPose = "idle" | "point" | "present" | "hold" | "think" | "wave";
export type BravoMood =
  | "neutral"
  | "amused"
  | "curious"
  | "teacher"
  | "worried"
  | "proud";

const SKIN = "#F3C39A";
const SKIN_SH = "#E2A57C";
const BLUSH = "#E89A86";
const HAIR = "#F25A1F";
const HAIR_DK = "#C63E12";
const HAIR_MD = "#E24A18";
const HAIR_LT = "#FF7A3A";
const VEST = "#2A6FBE";
const VEST_DK = "#1B4F96";
const SHIRT = "#F6F3EA";
const SHORTS = "#E4CFA0";
const SHORTS_ST = "#F3E4C0";
const SHOE = "#2A5FE0";
const LACE = "#F08B12";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function ik(
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  l1: number,
  l2: number,
  bend: number,
) {
  let dx = tx - sx;
  let dy = ty - sy;
  let d = Math.hypot(dx, dy) || 1;
  const max = l1 + l2 - 0.8;
  const min = Math.abs(l1 - l2) + 0.8;
  if (d > max) {
    dx = (dx / d) * max;
    dy = (dy / d) * max;
    d = max;
  } else if (d < min) {
    dx = (dx / d) * min;
    dy = (dy / d) * min;
    d = min;
  }
  const ang =
    Math.acos(
      Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))),
    ) * bend;
  const base = Math.atan2(dy, dx);
  const eAng = base + ang;
  const ex = sx + Math.cos(eAng) * l1;
  const ey = sy + Math.sin(eAng) * l1;
  return {
    ex,
    ey,
    hx: sx + dx,
    hy: sy + dy,
    hAng: Math.atan2(sy + dy - ey, sx + dx - ex),
  };
}

const Mouth: React.FC<{ viseme: string; mood: BravoMood }> = ({
  viseme,
  mood,
}) => {
  if (viseme === "A") {
    return (
      <path
        d="M236 248 Q260 254 284 248"
        fill="none"
        stroke="#8A3A32"
        strokeWidth="5"
        strokeLinecap="round"
      />
    );
  }
  if (viseme === "B") {
    return (
      <g>
        <ellipse cx="260" cy="254" rx="16" ry="8" fill="#7A302C" />
        <path d="M246 250 Q260 246 274 250" fill="#F7EFE6" />
      </g>
    );
  }
  if (viseme === "C") {
    return (
      <g>
        <ellipse cx="260" cy="256" rx="20" ry="14" fill="#7A302C" />
        <ellipse cx="260" cy="262" rx="12" ry="6" fill="#E57A86" />
        <path d="M242 248 Q260 244 278 248" fill="#F7EFE6" />
      </g>
    );
  }
  if (viseme === "D") {
    return (
      <g>
        <ellipse cx="260" cy="258" rx="18" ry="18" fill="#7A302C" />
        <ellipse cx="260" cy="266" rx="10" ry="7" fill="#E57A86" />
        <path d="M244 246 Q260 242 276 246" fill="#F7EFE6" />
      </g>
    );
  }
  if (viseme === "E") {
    return <ellipse cx="260" cy="255" rx="12" ry="13" fill="#7A302C" />;
  }
  if (viseme === "F") {
    return <ellipse cx="260" cy="255" rx="9" ry="14" fill="#7A302C" />;
  }
  if (viseme === "G") {
    return (
      <g>
        <path
          d="M240 250 Q260 258 280 250"
          fill="none"
          stroke="#8A3A32"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x="244" y="246" width="32" height="6" rx="1.5" fill="#F7EFE6" />
      </g>
    );
  }
  if (viseme === "H") {
    return (
      <g>
        <path
          d="M238 250 Q260 270 282 250 Q276 268 260 270 Q244 268 238 250Z"
          fill="#7A302C"
        />
        <path
          d="M252 262 Q264 256 274 262"
          fill="none"
          stroke="#E57A86"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    );
  }
  const smile =
    mood === "amused" || mood === "proud"
      ? "M236 248 Q260 268 284 248"
      : mood === "worried"
        ? "M240 256 Q260 248 280 256"
        : "M238 250 Q260 262 282 250";
  return (
    <path
      d={smile}
      fill="none"
      stroke="#C56A4A"
      strokeWidth="4.4"
      strokeLinecap="round"
    />
  );
};

const curls: Array<[number, number, number, number, string, number]> = [
  [168, 78, 34, 28, HAIR, -18],
  [210, 48, 36, 30, HAIR_LT, 12],
  [258, 36, 40, 32, HAIR, 4],
  [308, 48, 34, 28, HAIR_MD, -10],
  [348, 78, 32, 26, HAIR_LT, 16],
  [150, 118, 28, 24, HAIR_DK, -8],
  [372, 120, 27, 23, HAIR_DK, 8],
  [186, 58, 22, 18, HAIR_DK, 22],
  [238, 52, 20, 16, HAIR_MD, -14],
  [286, 54, 21, 17, HAIR_LT, 18],
  [330, 68, 18, 15, HAIR_DK, -20],
  [198, 96, 16, 14, HAIR_LT, 8],
  [262, 72, 18, 14, HAIR_DK, 0],
  [318, 98, 15, 13, HAIR_LT, -6],
  [172, 156, 22, 18, HAIR, -12],
  [348, 158, 21, 17, HAIR, 12],
  [156, 188, 18, 16, HAIR_MD, 8],
  [364, 190, 17, 15, HAIR_MD, -8],
  [230, 88, 14, 12, HAIR_LT, 30],
  [290, 86, 13, 11, HAIR, -24],
];

const Hair: React.FC = () => (
  <g>
    <path
      d="M260 22 C318 8 372 38 392 86 C428 70 458 108 450 150 C474 168 470 214 442 236 C456 268 428 298 396 292 C388 318 352 322 338 298 C300 312 220 312 182 298 C168 322 132 316 124 292 C92 298 64 268 78 236 C50 214 46 168 70 150 C62 108 92 70 128 86 C148 38 202 8 260 22Z"
      fill={HAIR}
    />
    <path
      d="M188 70 C214 44 258 36 300 48 C328 40 356 60 362 88 C338 70 300 62 262 70 C228 64 200 78 188 70Z"
      fill={HAIR_DK}
      opacity=".45"
    />
    {curls.map(([cx, cy, rx, ry, fill, rot], i) => (
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fill}
        transform={`rotate(${rot} ${cx} ${cy})`}
      />
    ))}
    <g
      fill="none"
      stroke={HAIR_DK}
      strokeWidth="6"
      strokeLinecap="round"
      opacity=".55"
    >
      <path d="M186 96 C178 70 208 62 224 88" />
      <path d="M236 70 C248 48 278 52 286 76" />
      <path d="M300 66 C318 46 344 58 346 84" />
      <path d="M338 102 C358 84 378 108 362 128" />
      <path d="M176 140 C164 118 186 108 204 128" />
    </g>
  </g>
);

const Arm: React.FC<{
  side: "left" | "right";
  pose: BravoPose;
  settle: number;
  frame: number;
}> = ({ side, pose, settle, frame }) => {
  const left = side === "left";
  const sx = left ? 186 : 334;
  const sy = 338;
  const wave = !left && pose === "wave" ? Math.sin(frame / 5) * 18 : 0;
  const idleX = left ? 156 : 400;
  const idleY = left ? 548 : 520;
  let tx = idleX;
  let ty = idleY;
  let hand: "fist" | "point" | "open" | "rest" = left ? "fist" : "rest";
  let bend = left ? -1 : 1;

  if (left) {
    if (pose === "hold") {
      tx = 210;
      ty = 430;
      hand = "open";
    }
  } else if (pose === "point") {
    tx = 508;
    ty = 268;
    hand = "point";
    bend = -1;
  } else if (pose === "present") {
    tx = 498;
    ty = 232;
    hand = "open";
    bend = -1;
  } else if (pose === "wave") {
    tx = 430;
    ty = 128 + wave;
    hand = "open";
    bend = -1;
  } else if (pose === "hold") {
    tx = 310;
    ty = 430;
    hand = "open";
    bend = 1;
  } else if (pose === "think") {
    tx = 348;
    ty = 236;
    hand = "fist";
    bend = -1;
  }

  tx = mix(idleX, tx, settle);
  ty = mix(idleY, ty, settle);
  const bone = ik(sx, sy, tx, ty, 86, 78, bend);
  const sleeveX = mix(sx, bone.ex, 0.48);
  const sleeveY = mix(sy, bone.ey, 0.48);

  return (
    <g>
      <path
        d={`M${sx} ${sy} L${bone.ex} ${bone.ey}`}
        fill="none"
        stroke={SKIN}
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d={`M${bone.ex} ${bone.ey} L${bone.hx} ${bone.hy}`}
        fill="none"
        stroke={SKIN}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d={`M${sx} ${sy} L${sleeveX} ${sleeveY}`}
        fill="none"
        stroke={SHIRT}
        strokeWidth="40"
        strokeLinecap="round"
      />
      <circle cx={sx} cy={sy} r="18" fill={SHIRT} />
      <g
        transform={`translate(${bone.hx} ${bone.hy}) rotate(${
          (bone.hAng * 180) / Math.PI
        })`}
      >
        {hand === "point" ? (
          <>
            <ellipse cx="8" cy="2" rx="14" ry="11" fill={SKIN} />
            <rect x="12" y="-4" width="26" height="8" rx="4" fill={SKIN} />
            <rect x="8" y="6" width="12" height="6" rx="3" fill={SKIN} />
          </>
        ) : hand === "open" ? (
          <>
            <ellipse cx="4" cy="2" rx="13" ry="11" fill={SKIN} />
            <ellipse cx="14" cy="-8" rx="4.5" ry="8" fill={SKIN} />
            <ellipse cx="18" cy="1" rx="4.5" ry="8" fill={SKIN} />
            <ellipse cx="14" cy="10" rx="4.5" ry="7" fill={SKIN} />
          </>
        ) : (
          <ellipse cx={left ? -4 : 6} cy="8" rx="13" ry="11" fill={SKIN} />
        )}
      </g>
    </g>
  );
};

export const BravoVector: React.FC<{
  x: number;
  y: number;
  width?: number;
  pose?: BravoPose;
  mood?: BravoMood;
  speaking?: boolean;
  facing?: "front" | "screen";
  settle?: number;
  holdItem?: "moon" | "apple";
}> = ({
  x,
  y,
  width = 520,
  pose = "idle",
  mood = "teacher",
  speaking = false,
  facing = "front",
  settle = 1,
  holdItem = "moon",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const cue = useMouthCue(seconds);
  const viseme = speaking && cue ? cue.value : "X";
  const blink = frame % 96 > 90;
  const breath = 1 + Math.sin(frame / 22) * 0.006;
  const jaw =
    viseme === "D"
      ? 5
      : viseme === "C"
        ? 3.5
        : viseme === "E" || viseme === "F"
          ? 2.4
          : viseme === "B" || viseme === "H"
            ? 1.6
            : 0;
  const talkNod = speaking ? Math.sin(frame / 7.4) * 0.7 + jaw * 0.12 : 0;
  const brow =
    mood === "worried" ? 7 : mood === "curious" ? -5 : mood === "amused" ? -2 : 0;
  const turn = facing === "screen" ? 3 : 0;
  const poseEase = interpolate(settle, [0, 1], [0.18, 1], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        zIndex: 8,
        pointerEvents: "none",
      }}
    >
      <svg viewBox="0 0 520 900" width="100%" overflow="visible">
        <ellipse cx="260" cy="790" rx="70" ry="8" fill="rgba(0,0,0,.32)" />

        <rect x="208" y="612" width="38" height="118" rx="18" fill={SKIN} />
        <rect x="274" y="612" width="38" height="118" rx="18" fill={SKIN} />
          <path
            d="M186 548 C210 528 260 522 334 548 L348 628 C300 648 220 648 172 628 Z"
            fill={SHORTS}
          />
          <path
            d="M214 556 L214 628 M260 548 L260 636 M306 556 L306 628"
            stroke={SHORTS_ST}
            strokeWidth="10"
          />
          <rect x="176" y="612" width="72" height="28" rx="12" fill="#EED9B0" />
          <rect x="272" y="612" width="72" height="28" rx="12" fill="#EED9B0" />
          <rect x="206" y="718" width="42" height="22" rx="6" fill="#FAFAF7" />
          <rect x="272" y="718" width="42" height="22" rx="6" fill="#FAFAF7" />
          <rect x="206" y="728" width="42" height="6" fill="#3A73E0" />
          <rect x="272" y="728" width="42" height="6" fill="#3A73E0" />
          <ellipse cx="226" cy="772" rx="38" ry="20" fill={SHOE} />
          <ellipse cx="294" cy="772" rx="38" ry="20" fill={SHOE} />
          <ellipse cx="232" cy="782" rx="32" ry="9" fill="#F0EBE0" />
          <ellipse cx="300" cy="782" rx="32" ry="9" fill="#F0EBE0" />
          <path
            d="M208 764 Q226 754 244 764"
            stroke={LACE}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M208 772 Q226 764 244 772"
            stroke={LACE}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M276 764 Q294 754 312 764"
            stroke={LACE}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M276 772 Q294 764 312 772"
            stroke={LACE}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

        <g
          transform={`scale(1 ${breath})`}
          style={{ transformOrigin: "260px 430px" }}
        >
          <path
            d="M198 328 L322 328 L348 360 L332 560 L188 560 L172 360 Z"
            fill={SHIRT}
          />
          <path d="M236 318 L260 352 L284 318 Z" fill={SHIRT} />
          <circle cx="260" cy="338" r="4" fill="#D2CBBE" />
          <path
            d="M204 336 L316 336 L336 358 L322 558 L198 558 L184 358 Z"
            fill={VEST}
          />
          <path d="M204 336 L316 336 L310 368 L210 368 Z" fill={VEST_DK} />
          <polygon points="260,372 292,404 260,436 228,404" fill="#C44532" />
          <polygon points="228,404 260,436 228,468 196,436" fill="#2F8BC8" />
          <polygon points="292,404 324,436 292,468 260,436" fill="#2F8BC8" />
          <polygon points="260,436 292,468 260,500 228,468" fill="#E2A31A" />
          <polygon points="228,468 260,500 228,532 196,500" fill="#C44532" />
          <polygon points="292,468 324,500 292,532 260,500" fill="#C44532" />
          <polygon points="196,372 228,404 196,436 172,404" fill="#1E5A9E" />
          <polygon points="324,372 348,404 324,436 292,404" fill="#1E5A9E" />
          <path
            d="M196 404 L324 404 M210 372 L310 500 M310 372 L210 500"
            stroke="rgba(255,214,110,.45)"
            strokeWidth="1.6"
            fill="none"
          />
          <rect x="198" y="536" width="124" height="26" rx="10" fill={VEST_DK} />
          <path
            d="M206 542 L314 542 M206 550 L314 550"
            stroke="#163E78"
            strokeWidth="2"
          />
        </g>

        <g
          transform={`translate(0 ${talkNod + jaw * 0.15}) rotate(${turn})`}
          style={{ transformOrigin: "260px 250px" }}
        >
          <Hair />
          <ellipse cx="148" cy="214" rx="22" ry="30" fill={SKIN} />
          <ellipse cx="372" cy="214" rx="22" ry="30" fill={SKIN} />
          <ellipse cx="260" cy="208" rx="96" ry="104" fill={SKIN} />
          <ellipse cx="260" cy="222" rx="88" ry="86" fill={SKIN} />
          <ellipse cx="218" cy="236" rx="22" ry="12" fill={BLUSH} opacity=".5" />
          <ellipse cx="302" cy="236" rx="22" ry="12" fill={BLUSH} opacity=".5" />
          <ellipse cx="148" cy="214" rx="18" ry="24" fill={SKIN_SH} opacity=".28" />
          <ellipse cx="372" cy="214" rx="18" ry="24" fill={SKIN_SH} opacity=".28" />

          <ellipse
            cx="186"
            cy="118"
            rx="18"
            ry="16"
            fill={HAIR}
            transform="rotate(-18 186 118)"
          />
          <ellipse
            cx="228"
            cy="98"
            rx="22"
            ry="18"
            fill={HAIR_LT}
            transform="rotate(12 228 98)"
          />
          <ellipse cx="260" cy="90" rx="20" ry="16" fill={HAIR} />
          <ellipse
            cx="294"
            cy="98"
            rx="20"
            ry="16"
            fill={HAIR_DK}
            transform="rotate(-10 294 98)"
          />
          <ellipse
            cx="334"
            cy="118"
            rx="18"
            ry="15"
            fill={HAIR_LT}
            transform="rotate(16 334 118)"
          />

          <path
            d={`M198 ${168 + brow} Q226 ${156 + brow} 248 ${168 + brow}`}
            fill="none"
            stroke="#3A2418"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <path
            d={`M272 ${168 + brow} Q294 ${156 + brow} 322 ${168 + brow}`}
            fill="none"
            stroke="#3A2418"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          <ellipse cx="222" cy="200" rx="22" ry={blink ? 2.4 : 24} fill="#FFFDF8" />
          <ellipse cx="298" cy="200" rx="22" ry={blink ? 2.4 : 24} fill="#FFFDF8" />
          {!blink && (
            <>
              <ellipse cx="224" cy="204" rx="11" ry="14" fill="#6A3A16" />
              <ellipse cx="296" cy="204" rx="11" ry="14" fill="#6A3A16" />
              <ellipse cx="224" cy="206" rx="6" ry="8" fill="#1B1715" />
              <ellipse cx="296" cy="206" rx="6" ry="8" fill="#1B1715" />
              <circle cx="218" cy="196" r="3.2" fill="#FFF" />
              <circle cx="290" cy="196" r="3.2" fill="#FFF" />
            </>
          )}

          <rect
            x="188"
            y="178"
            width="68"
            height="46"
            rx="10"
            fill="none"
            stroke="#171B22"
            strokeWidth="10"
          />
          <rect
            x="264"
            y="178"
            width="68"
            height="46"
            rx="10"
            fill="none"
            stroke="#171B22"
            strokeWidth="10"
          />
          <rect x="248" y="192" width="24" height="10" rx="4" fill="#171B22" />
          <rect x="176" y="174" width="16" height="8" rx="3" fill="#171B22" />
          <rect x="328" y="174" width="16" height="8" rx="3" fill="#171B22" />

          <g transform={`translate(0 ${jaw})`}>
            <Mouth viseme={viseme} mood={mood} />
          </g>
        </g>

        <Arm side="left" pose={pose} settle={poseEase} frame={frame} />
        <Arm side="right" pose={pose} settle={poseEase} frame={frame} />

        {pose === "hold" && holdItem === "apple" && (
          <g transform="translate(260 428)">
            <path
              d="M0 -32 C-8 -44 -26 -40 -32 -20 C-40 0 -34 28 -16 38 C-6 44 6 44 16 38 C34 28 40 0 32 -20 C26 -40 8 -44 0 -32 Z"
              fill="#D23A2A"
            />
            <path
              d="M0 -30 C4 -44 2 -50 0 -54"
              fill="none"
              stroke="#5A3A1C"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="M4 -48 C14 -54 22 -44 12 -40 C8 -44 6 -46 4 -48 Z" fill="#3F8A32" />
            <ellipse cx="-10" cy="-6" rx="8" ry="11" fill="#F07A68" opacity=".35" />
          </g>
        )}
        {pose === "hold" && holdItem !== "apple" && (
          <g transform="translate(260 428)">
            <circle r="46" fill="#C9B48A" />
            <circle cx="-10" cy="-8" r="9" fill="#A8946C" opacity=".45" />
            <circle cx="14" cy="12" r="12" fill="#A8946C" opacity=".35" />
          </g>
        )}
      </svg>
    </div>
  );
};
