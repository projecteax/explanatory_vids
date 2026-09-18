import React from "react";
import { Easing, interpolate } from "remotion";
import {
  Apple,
  Banana,
  BreadLoaf,
  BreadSlice,
  Broccoli,
  Broom,
  CandyBar,
  Carrot,
  ChipBag,
  Crate,
  Egg,
  Factory,
  Faucet,
  Germ,
  Handprint,
  Label,
  MilkCarton,
  MiniBroom,
  MiniShield,
  MiniShoe,
  OilDrop,
  PackagedSweet,
  Plate,
  SaltShaker,
  SoapBar,
  SodaBottle,
  SometimesTin,
  StickKid,
  SugarCube,
  Tooth,
  WaterGlass,
} from "./FoodShapes";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const reveal = (progress: number, from = 0, to = 0.22) =>
  interpolate(progress, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

const Potato: React.FC<{ x: number; y: number; s?: number }> = ({
  x,
  y,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path
      d="M-28 -8 C-34 -28 8 -36 28 -16 C40 8 18 32 -8 30 C-34 26 -30 8 -28 -8 Z"
      fill="#C9843A"
    />
    <ellipse cx="-8" cy="-4" rx="4" ry="3" fill="#8A5A28" />
    <ellipse cx="10" cy="8" rx="3" ry="2.5" fill="#8A5A28" />
  </g>
);

const TummyTunnel: React.FC<{ sweep: number }> = ({ sweep }) => (
  <g>
    <path
      d="M180 300 C320 220 520 220 720 300 C820 340 860 400 780 430 C640 490 360 490 220 430 C140 400 120 340 180 300 Z"
      fill="none"
      stroke="#E8D9A8"
      strokeWidth="8"
    />
      <Broom x={220 + 500 * sweep} y={360} s={0.95} rot={-25 + sweep * 20} />
  </g>
);

const LineSuperFuel: React.FC<{ progress: number }> = ({ progress }) => {
  const bounce = Math.sin(progress * Math.PI * 6) * 8;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <g opacity={reveal(progress)} transform={`translate(0 ${bounce})`}>
        <CandyBar x={340} y={250} s={1.35} />
        <SodaBottle x={760} y={270} s={1.15} />
      </g>
      <g opacity={reveal(progress, 0.35, 0.6)}>
        <Label x={550} y={470} size={36}>
          SUPER FUEL?
        </Label>
      </g>
    </svg>
  );
};

const LineSometimesEveryday: React.FC<{ progress: number }> = ({ progress }) => {
  const hop = interpolate(progress, [0.12, 0.48], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const lid = interpolate(progress, [0.45, 0.62], [1, 0.15], clamp);
  const walk = interpolate(progress, [0.28, 0.85], [0, 1], clamp);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Crate x={300} y={340} w={340} h={180} label="EVERYDAY" />
      <SometimesTin x={820} y={360} lid={lid} />
      <g
        transform={`translate(${340 + 420 * hop} ${210 - 80 * Math.sin(hop * Math.PI)})`}
        opacity={progress < 0.62 ? 1 : 0}
      >
        <CandyBar x={0} y={0} s={0.85} />
      </g>
      <g opacity={walk}>
        <Apple x={210 + 20 * walk} y={330} s={0.7} />
        <Carrot x={300} y={318} s={0.55} />
        <BreadLoaf x={400} y={340} s={0.55} />
      </g>
    </svg>
  );
};

const LineSixFoods: React.FC<{ progress: number }> = ({ progress }) => {
  const foods = [
    { t: 0.06, node: <Apple x={90} y={210} s={0.85} /> },
    { t: 0.16, node: <Carrot x={250} y={200} s={0.72} /> },
    { t: 0.26, node: <Banana x={430} y={210} s={0.78} /> },
    { t: 0.36, node: <Broccoli x={600} y={210} s={0.85} /> },
    { t: 0.46, node: <Egg x={760} y={210} s={0.95} /> },
    { t: 0.56, node: <BreadLoaf x={940} y={220} s={0.78} /> },
  ];
  const cut = reveal(progress, 0.68, 0.82);
  const helpers = reveal(progress, 0.78, 0.95);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      {foods.map((food, i) => (
        <g key={i} opacity={reveal(progress, food.t, food.t + 0.1)}>
          {food.node}
        </g>
      ))}
      <g opacity={cut} transform="translate(90 390)">
        <Apple x={0} y={0} s={0.9} bitten />
        <path d="M50 -10 L90 -40" stroke="#E8D9A8" strokeWidth="6" />
        <g opacity={helpers}>
          <MiniBroom x={130} y={-20} />
          <MiniShoe x={190} y={-8} />
          <MiniShield x={250} y={-12} />
        </g>
        <Label x={190} y={70} size={24}>
          HELPERS INSIDE
        </Label>
      </g>
    </svg>
  );
};

const LineAppleVsCandy: React.FC<{ progress: number }> = ({ progress }) => {
  const sweep = interpolate(progress, [0.28, 0.78], [0, 1], clamp);
  const glitter = reveal(progress, 0.55, 0.85);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Apple x={220} y={160} s={1.15} bitten />
      <TummyTunnel sweep={sweep} />
      <g opacity={glitter}>
        <CandyBar x={900} y={150} s={1} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SugarCube
            key={i}
            x={860 + (i % 3) * 28}
            y={220 + Math.floor(i / 3) * 26 + glitter * 40}
            s={0.9}
          />
        ))}
        <Label x={900} y={340} size={24} color="#E8B4A0">
          NO BROOM
        </Label>
      </g>
    </svg>
  );
};

const LineZapCrash: React.FC<{ progress: number }> = ({ progress }) => {
  const fly = interpolate(progress, [0.12, 0.48], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const crash = interpolate(progress, [0.5, 0.78], [0, 1], clamp);
  const x = 180 + 620 * fly;
  const y = 280 - 120 * Math.sin(fly * Math.PI);
  const rot = fly * 25 - crash * 40;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <CandyBar x={140} y={140} s={0.9} />
      <path
        d={`M180 280 C 360 ${180 - 40 * fly} 620 ${180 - 40 * fly} ${x} ${y}`}
        fill="none"
        stroke="#F0D78C"
        strokeWidth="6"
        strokeDasharray="12 10"
        opacity={1 - crash}
      />
      <StickKid
        x={crash > 0.4 ? 820 : x}
        y={crash > 0.4 ? 340 + crash * 40 : y}
        rot={rot}
        frown={crash > 0.35}
      />
      <g opacity={crash}>
        <path
          d="M700 420 L860 440"
          stroke="#E8B4A0"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Label x={550} y={80} size={32}>
          {crash > 0.5 ? "CRASH  TIRED  GRUMPY" : "FAST ZAP"}
        </Label>
      </g>
    </svg>
  );
};

const LineTeeth: React.FC<{ progress: number }> = ({ progress }) => {
  const dust = reveal(progress, 0.08, 0.28);
  const bugs = reveal(progress, 0.32, 0.55);
  const hole = interpolate(progress, [0.55, 0.82], [0, 1], clamp);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Tooth x={400} y={260} s={2.1} hole={hole} />
      <g opacity={dust}>
        <SugarCube x={360} y={160} />
        <SugarCube x={430} y={140} />
        <SugarCube x={490} y={170} />
      </g>
      <g opacity={bugs}>
        <Germ x={470} y={220} s={1.2} />
        <Germ x={520} y={270} s={1} color="#8A7040" />
        <Germ x={430} y={300} s={0.9} color="#4E6B28" />
      </g>
      <CandyBar x={860} y={240} s={0.85} />
      <g opacity={reveal(progress, 0.7, 0.9)}>
        <SometimesTin x={860} y={420} lid={0.2} />
      </g>
    </svg>
  );
};

const LineSoda: React.FC<{ progress: number }> = ({ progress }) => {
  const water = interpolate(progress, [0.12, 0.32], [0, 0.75], clamp);
  const cubes = reveal(progress, 0.32, 0.52);
  const bubbles = reveal(progress, 0.5, 0.7);
  const hop = interpolate(progress, [0.72, 0.95], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <WaterGlass x={180} y={260} s={1.05} fill={0.8} />
      <Label x={180} y={430} size={24}>
        WATER
      </Label>
      <MilkCarton x={430} y={250} s={1.05} />
      <Label x={430} y={430} size={24}>
        MILK
      </Label>
      <g transform={`translate(${720 + hop * 160} ${240 + hop * 80}) scale(${1 - hop * 0.35})`}>
        <SodaBottle x={0} y={0} s={1.05} />
      </g>
      <WaterGlass x={900} y={250} s={0.7} fill={water} />
      <g opacity={cubes}>
        {[0, 1, 2, 3].map((i) => (
          <SugarCube key={i} x={880 + (i % 2) * 24} y={120 + i * 18} />
        ))}
      </g>
      <g opacity={bubbles}>
        <circle cx="890" cy="210" r="6" fill="#A8D4E8" />
        <circle cx="910" cy="180" r="4" fill="#A8D4E8" />
        <circle cx="870" cy="160" r="5" fill="#A8D4E8" />
      </g>
      <g opacity={reveal(progress, 0.55, 0.7)}>
        <Label x={550} y={80} size={28}>
          I WANTED WATER
        </Label>
      </g>
      <g opacity={hop}>
        <SometimesTin x={980} y={430} lid={0.2} />
      </g>
    </svg>
  );
};

const LineFactory: React.FC<{ progress: number }> = ({ progress }) => {
  const belt = interpolate(progress, [0.08, 0.45], [0, 1], clamp);
  const extras = reveal(progress, 0.42, 0.62);
  const locked = reveal(progress, 0.68, 0.88);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Factory x={200} y={160} s={1.15} />
      <rect x="320" y="300" width="520" height="18" fill="#6B6B5A" />
      <g opacity={1 - belt}>
        <Potato x={360} y={276} s={1.1} />
      </g>
      <g opacity={belt} transform={`translate(${belt * 280} 0)`}>
        <ChipBag x={520} y={230} s={0.85} />
      </g>
      <g opacity={extras}>
        <SugarCube x={820} y={160} />
        <SugarCube x={850} y={180} />
        <SaltShaker x={900} y={170} />
        <OilDrop x={940} y={200} />
        <PackagedSweet x={980} y={280} s={0.9} />
      </g>
      <g opacity={locked}>
        <ChipBag x={800} y={360} s={0.7} />
        <MiniBroom x={700} y={380} />
        <MiniShoe x={740} y={390} />
        <MiniShield x={780} y={386} />
        <path d="M760 360 L820 320" stroke="#E24A3A" strokeWidth="6" />
        <Label x={800} y={500} size={26} color="#E8B4A0">
          HELPERS CANNOT IN
        </Label>
      </g>
    </svg>
  );
};

const LineWash: React.FC<{ progress: number }> = ({ progress }) => {
  const dirt = 1 - interpolate(progress, [0.35, 0.7], [0, 1], clamp);
  const waterOn = progress > 0.22;
  const soapSlide = interpolate(progress, [0.72, 0.9], [0, 1], clamp);
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Faucet x={280} y={80} s={1.4} on={waterOn} />
      <g opacity={0.4 + dirt * 0.6}>
        <Apple x={320} y={280} s={1.2} dirty={dirt > 0.3} />
        <Broccoli x={520} y={290} s={1.15} dirty={dirt > 0.3} />
      </g>
      <g opacity={dirt}>
        <Handprint x={380} y={250} s={1.1} />
        <Germ x={470} y={220} />
        <Germ x={560} y={250} color="#8A7040" />
      </g>
      <g transform={`translate(${700 + soapSlide * 180} ${220 - soapSlide * 40})`}>
        <SoapBar x={0} y={0} s={1.3} />
      </g>
      <g opacity={reveal(progress, 0.72, 0.88)}>
        <Label x={860} y={320} size={26} color="#E8B4A0">
          SOAP IS FOR HANDS
        </Label>
      </g>
      <g opacity={reveal(progress, 0.8, 0.95)}>
        <Label x={420} y={480} size={30}>
          CLEAN AND READY
        </Label>
      </g>
    </svg>
  );
};

const LineJobs: React.FC<{ progress: number }> = ({ progress }) => {
  const items = [
    {
      t: 0.05,
      food: <Apple x={360} y={188} s={0.58} />,
      extra: (
        <g>
          <MiniBroom x={360} y={340} />
          <Label x={360} y={400} size={18}>TUMMY</Label>
        </g>
      ),
    },
    {
      t: 0.18,
      food: <Carrot x={460} y={175} s={0.48} />,
      extra: (
        <g>
          <ellipse cx="460" cy="328" rx="20" ry="13" fill="#F3EBD2" />
          <ellipse cx="460" cy="328" rx="8" ry="8" fill="#1B3326" />
          <Label x={460} y={400} size={18}>SEE</Label>
        </g>
      ),
    },
    {
      t: 0.32,
      food: <Banana x={560} y={195} s={0.48} />,
      extra: (
        <g>
          <StickKid x={560} y={300} s={0.42} />
          <Label x={560} y={400} size={18}>LASTS</Label>
        </g>
      ),
    },
    {
      t: 0.46,
      food: <Broccoli x={655} y={182} s={0.5} />,
      extra: (
        <g>
          <MiniShield x={655} y={328} />
          <Label x={655} y={400} size={18}>WELL</Label>
        </g>
      ),
    },
    {
      t: 0.6,
      food: <Egg x={750} y={188} s={0.62} />,
      extra: (
        <g>
          <path d="M730 320 L770 320" stroke="#E8D9A8" strokeWidth="5" />
          <path d="M740 320 L740 278" stroke="#F0D78C" strokeWidth="5" />
          <Label x={750} y={400} size={18}>GROW</Label>
        </g>
      ),
    },
    {
      t: 0.74,
      food: <BreadSlice x={845} y={192} s={0.62} />,
      extra: (
        <g>
          <circle cx="845" cy="328" r="14" fill="#F3EBD2" />
          <Label x={845} y={400} size={18}>PLAY</Label>
        </g>
      ),
    },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      <Plate x={600} y={200} s={1.35} />
      {items.map((item) => (
        <g key={item.t} opacity={reveal(progress, item.t, item.t + 0.12)}>
          {item.food}
          {item.extra}
        </g>
      ))}
    </svg>
  );
};

const LineMission: React.FC<{ progress: number }> = ({ progress }) => {
  const panels = [
    { t: 0.05, node: (
      <g>
        <Faucet x={80} y={40} s={0.7} on />
        <Apple x={130} y={130} s={0.7} />
      </g>
    ) },
    { t: 0.22, node: <Apple x={130} y={130} s={0.75} bitten /> },
    { t: 0.4, node: <WaterGlass x={130} y={120} s={0.7} fill={0.35} /> },
    { t: 0.58, node: (
      <g>
        <SometimesTin x={130} y={140} lid={0.1} />
        <CandyBar x={130} y={40} s={0.55} />
      </g>
    ) },
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 1100 560">
      {panels.map((panel, i) => (
        <g
          key={i}
          transform={`translate(${40 + i * 270} 80)`}
          opacity={reveal(progress, panel.t, panel.t + 0.14)}
        >
          <rect width="250" height="280" fill="none" stroke="#E8D9A8" strokeWidth="6" />
          {panel.node}
        </g>
      ))}
      <g opacity={reveal(progress, 0.75, 0.92)}>
        <Crate x={280} y={480} w={220} h={90} label="EVERYDAY" />
        <SometimesTin x={820} y={490} lid={0.15} />
      </g>
    </svg>
  );
};

export const FoodGraphic: React.FC<{ line: number; progress: number }> = ({
  line,
  progress,
}) => {
  if (line === 1) return <LineSuperFuel progress={progress} />;
  if (line === 2) return <LineSometimesEveryday progress={progress} />;
  if (line === 3) return <LineSixFoods progress={progress} />;
  if (line === 4 || line === 5) return <LineAppleVsCandy progress={progress} />;
  if (line === 6) return <LineZapCrash progress={progress} />;
  if (line === 7 || line === 8) return <LineTeeth progress={progress} />;
  if (line === 9) return <LineSoda progress={progress} />;
  if (line === 10 || line === 11) return <LineFactory progress={progress} />;
  if (line === 12 || line === 13) return <LineWash progress={progress} />;
  if (line === 14) return <LineJobs progress={progress} />;
  return <LineMission progress={progress} />;
};
