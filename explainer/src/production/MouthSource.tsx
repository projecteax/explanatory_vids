import React, { createContext, useContext } from "react";
import moon from "../production-data/mouth-cues.json";
import food from "../food-data/mouth-cues.json";

type Source = "moon" | "food";
const Ctx = createContext<Source>("moon");

export const MouthSourceProvider = Ctx.Provider;

export const useMouthCue = (seconds: number) => {
  const source = useContext(Ctx);
  const data = source === "food" ? food : moon;
  return data.mouthCues.find(
    (cue) => seconds >= cue.start && seconds < cue.end,
  );
};
