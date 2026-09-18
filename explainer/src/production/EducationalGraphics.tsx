import React from "react";
import { Easing, interpolate } from "remotion";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const reveal = (progress: number, from = 0, to = 0.22) =>
  interpolate(progress, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const Moon: React.FC<{
  x: number;
  y: number;
  r: number;
  phase?: "new" | "crescent" | "half" | "gibbous" | "full";
  opacity?: number;
}> = ({ x, y, r, phase = "full", opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r} fill={phase === "new" ? "transparent" : "#EFE2B8"} />
    {phase === "new" && (
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke="#C9D7C4"
        strokeWidth="4"
        strokeDasharray="8 8"
      />
    )}
    {phase === "crescent" && (
      <circle cx={x + r * 0.42} cy={y - r * 0.12} r={r * 0.92} fill="#1B3326" />
    )}
    {phase === "half" && (
      <path
        d={`M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x} ${y + r} Z`}
        fill="#1B3326"
      />
    )}
    {phase === "gibbous" && (
      <ellipse cx={x + r * 0.62} cy={y} rx={r * 0.42} ry={r * 0.9} fill="#1B3326" />
    )}
    {phase !== "new" && (
      <>
        <circle cx={x - r * 0.32} cy={y - r * 0.2} r={r * 0.1} fill="#C9B888" opacity=".55" />
        <circle cx={x + r * 0.16} cy={y + r * 0.32} r={r * 0.15} fill="#C9B888" opacity=".4" />
      </>
    )}
  </g>
);

const Label: React.FC<{ x: number; y: number; children: React.ReactNode; color?: string }> = ({
  x,
  y,
  children,
  color = "#F3EBD2",
}) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill={color}
    fontFamily="Mikado"
    fontSize="32"
  >
    {children}
  </text>
);

export const EducationalGraphic: React.FC<{
  line: number;
  progress: number;
}> = ({ line, progress }) => {
  const r1 = reveal(progress);
  const r2 = reveal(progress, 0.2, 0.44);
  const travel = Easing.inOut(Easing.cubic)(progress);

  if (line <= 2) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <g transform={`translate(0 ${25 * (1 - r1)})`} opacity={r1}>
          <Moon x={330} y={265} r={128} phase="full" />
          <Label x={330} y={445}>LAST WEEK — BIG CIRCLE</Label>
        </g>
        <path
          d="M510 265 L610 265"
          stroke="#E8B4A0"
          strokeWidth="8"
          strokeLinecap="round"
          opacity={r2}
        />
        <path d="M600 240 L635 265 L600 290" fill="none" stroke="#E8B4A0" strokeWidth="8" opacity={r2} />
        <g transform={`translate(0 ${25 * (1 - r2)})`} opacity={r2}>
          <Moon x={790} y={265} r={128} phase="crescent" />
          <Label x={790} y={445} color="#E8B4A0">TONIGHT — TINY SMILE</Label>
        </g>
      </svg>
    );
  }

  if (line === 3) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <g opacity={r1}>
          <text x="550" y="230" textAnchor="middle" fill="#F3EBD2" fontFamily="Mikado" fontSize="72">
            SCIENCE SNACK
          </text>
          <text x="550" y="330" textAnchor="middle" fill="#E8D9A8" fontFamily="Mikado" fontSize="48">
            GO  GO  GO
          </text>
        </g>
      </svg>
    );
  }

  if (line === 4 || line === 5) {
    const squash = line === 5 ? 1 - Math.sin(progress * Math.PI * 4) * 0.05 : 1;
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <defs>
          <radialGradient id="ball" cx="34%" cy="28%">
            <stop offset="0%" stopColor="#F7EDD0" />
            <stop offset="68%" stopColor="#D5C08A" />
            <stop offset="100%" stopColor="#9B8658" />
          </radialGradient>
        </defs>
        <g transform={`translate(550 265) scale(${r1 * squash} ${r1 / squash})`}>
          <circle r="185" fill="url(#ball)" />
          <circle cx="-58" cy="-38" r="24" fill="#a38b61" opacity=".42" />
          <circle cx="62" cy="72" r="38" fill="#a38b61" opacity=".34" />
          <ellipse cx="0" cy="208" rx="205" ry="24" fill="rgba(0,0,0,.28)" />
        </g>
        <Label x={550} y={515}>{line === 5 ? "SQUISHY MODEL — STILL A BALL" : "GIANT ROCKY BALL"}</Label>
      </svg>
    );
  }

  if (line === 6 || line === 7) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <circle cx="165" cy="270" r="88" fill="#F0D78C" opacity={r1} />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={165 + Math.cos(angle) * 105}
              y1={270 + Math.sin(angle) * 105}
              x2={165 + Math.cos(angle) * 135}
              y2={270 + Math.sin(angle) * 135}
              stroke="#F0D78C"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={r1}
            />
          );
        })}
        <polygon
          points="270,190 760,215 760,325 270,350"
          fill="rgba(240,215,140,.16)"
          opacity={r2}
        />
        <g opacity={r2}>
          <circle cx="835" cy="270" r="145" fill="#243D2E" />
          <path d="M835 125 A145 145 0 0 0 835 415 Z" fill="#EFE2B8" />
          <Label x={700} y={500} color="#F0D78C">SUNNY CHEEK</Label>
          <Label x={970} y={500} color="#C9D7C4">SLEEPY CHEEK</Label>
        </g>
      </svg>
    );
  }

  if (line === 8) {
    const angle = travel * Math.PI * 2;
    const mx = 550 + Math.cos(angle) * 315;
    const my = 280 + Math.sin(angle) * 155;
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <circle cx="105" cy="280" r="67" fill="#F0D78C" />
        <ellipse cx="550" cy="280" rx="315" ry="155" fill="none" stroke="#E8D9A8" strokeWidth="4" strokeDasharray="10 10" />
        <circle cx="550" cy="280" r="78" fill="#7FAE8A" />
        <Label x={550} y={292}>EARTH</Label>
        <Moon x={mx} y={my} r={43} />
        <Label x={550} y={530}>THE MOON TRAVELS AROUND US</Label>
      </svg>
    );
  }

  if (line === 9 || line === 10) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <g transform={`translate(550 255) scale(${0.8 + r1 * 0.2})`}>
          <Moon x={0} y={0} r={188} phase="full" />
        </g>
        <Label x={550} y={495} color={line === 10 ? "#E8D9A8" : "#F3EBD2"}>
          {line === 10 ? "BIG COOKIE — DO NOT EAT" : "FULL MOON"}
        </Label>
      </svg>
    );
  }

  if (line === 11 || line === 12) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <Moon x={550} y={255} r={190} phase="new" opacity={r1} />
        <path d="M390 255 Q550 120 710 255" fill="none" stroke="#536684" strokeWidth="4" strokeDasharray="8 8" opacity={r2} />
        <Label x={550} y={495} color={line === 12 ? "#E8D9A8" : "#C9D7C4"}>
          {line === 12 ? "SNEAKY MOON — STILL THERE" : "NEW MOON"}
        </Label>
      </svg>
    );
  }

  if (line === 13 || line === 14) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <Moon x={550} y={250} r={190} phase="crescent" opacity={r1} />
        <Label x={550} y={495} color={line === 14 ? "#E8D9A8" : "#F3EBD2"}>
          {line === 14 ? "MOON BANANA — ALSO NOT FOOD" : "CRESCENT"}
        </Label>
      </svg>
    );
  }

  if (line === 15) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <g opacity={r1}>
          <Moon x={325} y={250} r={145} phase="half" />
          <Label x={325} y={470}>HALF MOON</Label>
        </g>
        <g opacity={r2}>
          <Moon x={790} y={250} r={145} phase="gibbous" />
          <Label x={790} y={470}>GIBBOUS</Label>
        </g>
      </svg>
    );
  }

  if (line === 16) {
    const phases: Array<"new" | "crescent" | "half" | "gibbous" | "full"> = [
      "new",
      "crescent",
      "half",
      "gibbous",
      "full",
    ];
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        {phases.map((phase, index) => (
          <g key={phase} opacity={reveal(progress, index * 0.1, index * 0.1 + 0.2)}>
            <Moon x={150 + index * 200} y={245} r={78} phase={phase} />
          </g>
        ))}
        <path d="M150 380 C360 470 760 470 950 380" fill="none" stroke="#E8D9A8" strokeWidth="6" />
        <Label x={550} y={510}>ABOUT ONE MONTH</Label>
      </svg>
    );
  }

  if (line === 17) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <g opacity={r1}>
          <text x="550" y="215" textAnchor="middle" fill="#F3EBD2" fontFamily="Mikado" fontSize="62">
            SHAPE CHANGE
          </text>
          <text x="550" y="320" textAnchor="middle" fill="#E8D9A8" fontFamily="Mikado" fontSize="86">
            =
          </text>
          <text x="550" y="430" textAnchor="middle" fill="#F3EBD2" fontFamily="Mikado" fontSize="62">
            VIEW CHANGE
          </text>
        </g>
      </svg>
    );
  }

  if (line === 18) {
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        <Moon x={550} y={250} r={180} phase="crescent" opacity={r1} />
        <Label x={550} y={485}>SAME MOON • DIFFERENT SUNLIGHT</Label>
      </svg>
    );
  }

  if (line === 19) {
    const choices: Array<["crescent" | "half" | "full", string]> = [
      ["crescent", "BANANA"],
      ["half", "HALF"],
      ["full", "COOKIE"],
    ];
    return (
      <svg width="100%" height="100%" viewBox="0 0 1100 560">
        {choices.map(([phase, name], index) => (
          <g key={name} opacity={reveal(progress, index * 0.14, index * 0.14 + 0.2)}>
            <Moon x={260 + index * 290} y={250} r={105} phase={phase} />
            <Label x={260 + index * 290} y={440}>{name}</Label>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <g opacity={r1}>
        <Moon x={550} y={235} r={155} phase="full" />
        <text x="550" y="455" textAnchor="middle" fill="#E8D9A8" fontFamily="Mikado" fontSize="54">
          MYSTERY SOLVED
        </text>
      </g>
    </svg>
  );
};
