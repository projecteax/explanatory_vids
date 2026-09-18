import React from "react";

/** Hand-drawn chalkboard product silhouettes — never generic circles-as-food. */

export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  anchor?: "middle" | "start" | "end";
}> = ({ x, y, children, color = "#F3EBD2", size = 28, anchor = "middle" }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fill={color}
    fontFamily="Mikado"
    fontSize={size}
  >
    {children}
  </text>
);

export const Apple: React.FC<{
  x: number;
  y: number;
  s?: number;
  bitten?: boolean;
  dirty?: boolean;
}> = ({ x, y, s = 1, bitten = false, dirty = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M0 -42 C-10 -56 -34 -52 -42 -28 C-52 -2 -44 34 -22 48 C-8 56 8 56 22 48 C44 34 52 -2 42 -28 C34 -52 10 -56 0 -42 Z"
      fill="#D23A2A"
    />
    {bitten ? (
      <path d="M38 -8 C22 -2 18 16 34 28 C44 18 48 4 38 -8 Z" fill="#1B3326" />
    ) : null}
    <path
      d="M0 -40 C4 -58 2 -66 0 -72"
      fill="none"
      stroke="#5A3A1C"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path d="M4 -62 C18 -70 28 -56 16 -50 C10 -54 6 -58 4 -62 Z" fill="#3F8A32" />
    <ellipse cx="-14" cy="-8" rx="10" ry="14" fill="#F07A68" opacity=".35" />
    {dirty ? (
      <>
        <ellipse cx="-18" cy="8" rx="5" ry="3.5" fill="#6B5428" opacity=".85" />
        <ellipse cx="12" cy="22" rx="4" ry="3" fill="#6B5428" opacity=".8" />
        <ellipse cx="20" cy="-4" rx="3.5" ry="2.5" fill="#8A7040" />
      </>
    ) : null}
  </g>
);

export const Carrot: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 -36 L16 -36 L2 78 Z" fill="#E07A1A" />
    <path d="M-10 -20 L8 -18" stroke="#C45E10" strokeWidth="3" opacity=".5" />
    <path d="M-8 8 L6 12" stroke="#C45E10" strokeWidth="3" opacity=".45" />
    <path d="M-4 36 L4 40" stroke="#C45E10" strokeWidth="2.5" opacity=".4" />
    <path d="M-6 -36 C-18 -70 -4 -78 0 -48" fill="#2F7A28" />
    <path d="M2 -36 C8 -76 22 -70 10 -40" fill="#3F8A32" />
    <path d="M6 -36 C18 -64 28 -58 12 -38" fill="#4E9A3E" />
  </g>
);

export const Banana: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-62 18 C-48 -28 8 -48 62 8 C70 18 66 28 54 24 C10 -8 -36 6 -54 28 C-62 32 -68 28 -62 18 Z"
      fill="#E8C84A"
    />
    <path
      d="M-50 16 C-36 -18 8 -34 52 10"
      fill="none"
      stroke="#C9A428"
      strokeWidth="3"
      opacity=".45"
    />
    <path d="M-62 18 C-70 8 -66 -2 -58 4" fill="#6B8F32" />
    <path d="M62 8 C70 2 76 10 70 16" fill="#6B8F32" />
  </g>
);

export const Broccoli: React.FC<{
  x: number;
  y: number;
  s?: number;
  dirty?: boolean;
}> = ({ x, y, s = 1, dirty = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 8 L10 8 L14 58 L-14 58 Z" fill="#7FAE62" />
    <path d="M-8 20 L8 20" stroke="#5A8A40" strokeWidth="3" opacity=".5" />
    <ellipse cx="-22" cy="-8" rx="22" ry="18" fill="#2E6B32" />
    <ellipse cx="20" cy="-6" rx="24" ry="20" fill="#2A6230" />
    <ellipse cx="0" cy="-28" rx="26" ry="22" fill="#348038" />
    <ellipse cx="-8" cy="-4" rx="18" ry="16" fill="#3F8A32" />
    <ellipse cx="12" cy="-18" rx="16" ry="14" fill="#2F7A28" />
    <ellipse cx="4" cy="2" rx="14" ry="12" fill="#4E9A3E" />
    {dirty ? (
      <>
        <ellipse cx="-16" cy="-20" rx="4" ry="3" fill="#6B5428" />
        <ellipse cx="18" cy="-2" rx="3.5" ry="2.5" fill="#8A7040" />
      </>
    ) : null}
  </g>
);

export const Egg: React.FC<{
  x: number;
  y: number;
  s?: number;
  cracked?: boolean;
}> = ({ x, y, s = 1, cracked = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {cracked ? (
      <>
        <ellipse cx="0" cy="18" rx="36" ry="10" fill="#E8D9A8" opacity=".35" />
        <path
          d="M-28 4 C-20 -18 20 -18 28 4 L18 10 C8 -4 -8 -4 -18 10 Z"
          fill="#F4EFE0"
        />
        <ellipse cx="0" cy="16" rx="18" ry="12" fill="#E8C84A" />
      </>
    ) : (
      <>
        <ellipse cx="0" cy="4" rx="28" ry="38" fill="#F4EFE0" />
        <ellipse cx="-8" cy="-6" rx="8" ry="12" fill="#FFFFFF" opacity=".45" />
      </>
    )}
  </g>
);

export const BreadLoaf: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-52 18 C-52 -8 -30 -28 0 -32 C30 -28 52 -8 52 18 C52 36 36 44 0 44 C-36 44 -52 36 -52 18 Z"
      fill="#C9843A"
    />
    <path
      d="M-40 8 C-28 -8 28 -8 40 8"
      fill="none"
      stroke="#A86A28"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M-28 22 C-16 10 16 10 28 22"
      fill="none"
      stroke="#E8C49A"
      strokeWidth="4"
      opacity=".55"
    />
  </g>
);

export const BreadSlice: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-30 22 C-30 -6 -16 -24 0 -26 C16 -24 30 -6 30 22 C30 34 18 40 0 40 C-18 40 -30 34 -30 22 Z"
      fill="#E8C49A"
    />
    <path
      d="M-30 22 C-30 -6 -16 -24 0 -26 C16 -24 30 -6 30 22"
      fill="none"
      stroke="#C9843A"
      strokeWidth="7"
    />
  </g>
);

export const CandyBar: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 -22 L70 -22 L70 22 L-70 22 Z" fill="#6B1C1C" />
    <path d="M-70 -22 L-86 -8 L-86 8 L-70 22 Z" fill="#E24A3A" />
    <path d="M70 -22 L86 -8 L86 8 L70 22 Z" fill="#E24A3A" />
    <rect x="-36" y="-14" width="72" height="28" fill="#F0D78C" />
    <text
      x="0"
      y="8"
      textAnchor="middle"
      fill="#6B1C1C"
      fontFamily="Mikado"
      fontSize="16"
    >
      CANDY
    </text>
  </g>
);

export const SodaBottle: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-10" y="-72" width="20" height="16" rx="3" fill="#E24A3A" />
    <path d="M-8 -56 L8 -56 L12 -32 L-12 -32 Z" fill="#7FB8D4" opacity=".7" />
    <path
      d="M-22 -32 L22 -32 L26 58 C26 70 16 78 0 78 C-16 78 -26 70 -26 58 Z"
      fill="#C62828"
    />
    <rect x="-18" y="-8" width="36" height="28" fill="#F3EBD2" />
    <text
      x="0"
      y="12"
      textAnchor="middle"
      fill="#C62828"
      fontFamily="Mikado"
      fontSize="14"
    >
      SODA
    </text>
    <ellipse cx="-8" cy="40" rx="6" ry="10" fill="#FFFFFF" opacity=".2" />
  </g>
);

export const ChipBag: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-40 -58 L40 -58 L48 62 L-48 62 Z"
      fill="#E8A020"
    />
    <rect x="-40" y="-58" width="80" height="18" fill="#C45A3A" />
    <ellipse cx="0" cy="8" rx="26" ry="22" fill="#F0D78C" />
    <path d="M-16 4 C-4 -8 8 16 18 2" fill="none" stroke="#C9843A" strokeWidth="5" />
    <text
      x="0"
      y="52"
      textAnchor="middle"
      fill="#6B1C1C"
      fontFamily="Mikado"
      fontSize="16"
    >
      CHIPS
    </text>
  </g>
);

export const PackagedSweet: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-28 -20 L28 -20 L28 20 L-28 20 Z" fill="#7A3EA8" />
    <path d="M-28 -20 L-44 0 L-28 20 Z" fill="#E8B4D4" />
    <path d="M28 -20 L44 0 L28 20 Z" fill="#E8B4D4" />
    <circle cx="0" cy="0" r="10" fill="#F0D78C" />
  </g>
);

export const WaterGlass: React.FC<{
  x: number;
  y: number;
  s?: number;
  fill?: number;
}> = ({ x, y, s = 1, fill = 0.7 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-28 -48 L28 -48 L22 52 L-22 52 Z" fill="none" stroke="#E8D9A8" strokeWidth="6" />
    <path
      d={`M-26 48 L-26 ${48 - 92 * fill} L${26 - 4 * fill} ${48 - 92 * fill} L22 48 Z`}
      fill="#7FB8D4"
      opacity=".75"
    />
  </g>
);

export const MilkCarton: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-28 -20 L28 -20 L28 58 L-28 58 Z" fill="#F4EFE0" />
    <path d="M-28 -20 L0 -48 L28 -20 Z" fill="#F4EFE0" />
    <path d="M-28 -20 L0 -48 L0 -20 Z" fill="#E8D9A8" />
    <rect x="-28" y="4" width="56" height="22" fill="#3A6EA5" />
    <text
      x="0"
      y="20"
      textAnchor="middle"
      fill="#F4EFE0"
      fontFamily="Mikado"
      fontSize="14"
    >
      MILK
    </text>
  </g>
);

export const Tooth: React.FC<{
  x: number;
  y: number;
  s?: number;
  hole?: number;
}> = ({ x, y, s = 1, hole = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-36 -40 C-40 -70 40 -70 36 -40 L32 8 C32 28 18 48 8 58 C2 46 -2 46 -8 58 C-18 48 -32 28 -32 8 Z"
      fill="#F4EFE0"
    />
    <ellipse cx="-12" cy="-28" rx="10" ry="8" fill="#FFFFFF" opacity=".4" />
    {hole > 0 ? (
      <ellipse
        cx="10"
        cy="-8"
        rx={8 * hole}
        ry={6 * hole}
        fill="#1B3326"
      />
    ) : null}
  </g>
);

export const Germ: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
}> = ({ x, y, s = 1, color = "#6B8F32" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx="14" ry="10" fill={color} />
    <path d="M-10 -8 L-16 -16" stroke={color} strokeWidth="3" />
    <path d="M10 -8 L16 -16" stroke={color} strokeWidth="3" />
    <path d="M0 10 L0 18" stroke={color} strokeWidth="3" />
    <circle cx="-5" cy="-2" r="2" fill="#1B3326" />
    <circle cx="5" cy="-2" r="2" fill="#1B3326" />
  </g>
);

export const Broom: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({
  x,
  y,
  s = 1,
  rot = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x="-4" y="-70" width="8" height="78" rx="3" fill="#C9843A" />
    <path d="M-22 8 L22 8 L18 40 L-18 40 Z" fill="#E8C84A" />
    <path d="M-16 8 L-16 40 M-6 8 L-6 40 M4 8 L4 40 M14 8 L14 40" stroke="#C9A428" strokeWidth="2" />
  </g>
);

export const Crate: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
}> = ({ x, y, w = 280, h = 160, label }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#8A5A28" />
    <rect
      x={-w / 2 + 10}
      y={-h / 2 + 10}
      width={w - 20}
      height={h - 20}
      fill="none"
      stroke="#C9843A"
      strokeWidth="6"
    />
    <Label x={0} y={-h / 2 - 16} size={24}>
      {label}
    </Label>
  </g>
);

export const SometimesTin: React.FC<{
  x: number;
  y: number;
  lid?: number;
}> = ({ x, y, lid = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-70" y="-20" width="140" height="90" rx="8" fill="#6B4423" />
    <rect x="-62" y="-12" width="124" height="74" rx="4" fill="#3A2814" />
    <g transform={`translate(0 ${-40 * lid}) rotate(${-18 * lid})`}>
      <rect x="-74" y="-28" width="148" height="22" rx="4" fill="#C9843A" />
    </g>
    <Label x={0} y={-58} size={22}>
      SOMETIMES
    </Label>
  </g>
);

export const Factory: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-80" y="-10" width="160" height="90" fill="#8A8A7A" />
    <rect x="-90" y="70" width="180" height="16" fill="#6B6B5A" />
    <rect x="-60" y="20" width="28" height="36" fill="#1B3326" />
    <rect x="-20" y="20" width="28" height="36" fill="#1B3326" />
    <rect x="22" y="20" width="28" height="36" fill="#1B3326" />
    <rect x="40" y="-70" width="18" height="60" fill="#7A7A6A" />
    <rect x="10" y="-58" width="16" height="48" fill="#7A7A6A" />
    <path d="M44 -70 C60 -90 70 -80 58 -70" fill="#A8A8A0" opacity=".7" />
    <path d="M14 -58 C28 -78 40 -70 28 -58" fill="#A8A8A0" opacity=".55" />
  </g>
);

export const Faucet: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({
  x,
  y,
  s = 1,
  on = true,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-70" y="-16" width="70" height="18" rx="6" fill="#C9C4B0" />
    <rect x="-16" y="-16" width="18" height="36" rx="4" fill="#C9C4B0" />
    <rect x="-80" y="-28" width="22" height="14" rx="4" fill="#E8D9A8" />
    {on ? (
      <>
        <path d="M-8 22 C-4 40 4 40 8 70" fill="none" stroke="#7FB8D4" strokeWidth="8" />
        <path d="M4 22 C8 36 12 44 6 68" fill="none" stroke="#A8D4E8" strokeWidth="4" />
      </>
    ) : null}
  </g>
);

export const Plate: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx="210" ry="78" fill="none" stroke="#E8D9A8" strokeWidth="10" />
    <ellipse rx="150" ry="48" fill="none" stroke="#C9B888" strokeWidth="4" />
  </g>
);

export const SugarCube: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-10" y="-10" width="20" height="20" fill="#F4EFE0" stroke="#E8D9A8" strokeWidth="2" />
  </g>
);

export const SaltShaker: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 20 L12 20 L8 -16 L-8 -16 Z" fill="#F4EFE0" />
    <rect x="-10" y="-24" width="20" height="10" rx="3" fill="#E8D9A8" />
    <circle cx="-4" cy="-19" r="1.6" fill="#1B3326" />
    <circle cx="4" cy="-19" r="1.6" fill="#1B3326" />
    <circle cx="0" cy="-19" r="1.6" fill="#1B3326" />
  </g>
);

export const OilDrop: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -18 C10 -2 10 12 0 16 C-10 12 -10 -2 0 -18 Z" fill="#E8C84A" />
  </g>
);

export const MiniBroom: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <Broom x={x} y={y} s={0.28} rot={-20} />
);

export const MiniShoe: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-16 4 L12 4 L18 10 L-16 10 Z" fill="#3A6EA5" />
    <path d="M-16 0 L-4 0 L-4 4 L-16 4 Z" fill="#3A6EA5" />
  </g>
);

export const MiniShield: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 -16 L14 -8 L12 10 L0 18 L-12 10 L-14 -8 Z" fill="#F0D78C" />
    <path d="M0 -10 L8 -4 L6 8 L0 14 L-6 8 L-8 -4 Z" fill="#4E9A3E" />
  </g>
);

export const StickKid: React.FC<{
  x: number;
  y: number;
  s?: number;
  rot?: number;
  frown?: boolean;
}> = ({ x, y, s = 1, rot = 0, frown = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r="16" fill="#F3EBD2" />
    <circle cx="-5" cy="-2" r="2.2" fill="#1B3326" />
    <circle cx="5" cy="-2" r="2.2" fill="#1B3326" />
    <path
      d={frown ? "M-6 8 Q0 2 6 8" : "M-6 6 Q0 12 6 6"}
      fill="none"
      stroke="#1B3326"
      strokeWidth="2.4"
    />
    <path d="M0 16 L0 52" stroke="#F3EBD2" strokeWidth="5" />
    <path d="M0 28 L-18 40" stroke="#F3EBD2" strokeWidth="5" />
    <path d="M0 28 L18 40" stroke="#F3EBD2" strokeWidth="5" />
    <path d="M0 52 L-12 74" stroke="#F3EBD2" strokeWidth="5" />
    <path d="M0 52 L12 74" stroke="#F3EBD2" strokeWidth="5" />
  </g>
);

export const SoapBar: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-28" y="-14" width="56" height="28" rx="10" fill="#E8B4D4" />
    <Label x={0} y={6} size={14} color="#6B1C4A">
      SOAP
    </Label>
  </g>
);

export const Handprint: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".7">
    <ellipse cx="0" cy="8" rx="10" ry="12" fill="#C9A888" />
    <ellipse cx="-12" cy="-4" rx="4" ry="10" fill="#C9A888" />
    <ellipse cx="-4" cy="-10" rx="4" ry="12" fill="#C9A888" />
    <ellipse cx="4" cy="-10" rx="4" ry="12" fill="#C9A888" />
    <ellipse cx="12" cy="-4" rx="4" ry="10" fill="#C9A888" />
  </g>
);
