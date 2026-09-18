import React from "react";
import { Composition } from "remotion";
import { MoonExplainer } from "./MoonExplainer";
import { MoonExplainer30 } from "./MoonExplainer30";
import { FullMoonEpisode } from "./production/FullMoonEpisode";
import { VectorRigTest } from "./production/VectorRigTest";
import { FoodEpisode } from "./production/FoodEpisode";
import productionTimeline from "./production-data/timeline.json";
import foodTimeline from "./food-data/timeline.json";
import timeline from "./timeline.json";

export const RemotionRoot: React.FC = () => {
  const fps = timeline.fps;
  const durationInFrames = Math.ceil(timeline.duration_seconds * fps) + fps;

  return (
    <>
      <Composition
        id="MoonExplainer"
        component={MoonExplainer}
        durationInFrames={durationInFrames}
        fps={fps}
        width={timeline.width}
        height={timeline.height}
        defaultProps={{}}
      />
      <Composition
        id="MoonExplainer30"
        component={MoonExplainer30}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      <Composition
        id="WidgeteersMoonFinal"
        component={FullMoonEpisode}
        durationInFrames={Math.round(
          productionTimeline.duration_seconds * productionTimeline.fps,
        )}
        fps={productionTimeline.fps}
        width={productionTimeline.width}
        height={productionTimeline.height}
        defaultProps={{}}
      />
      <Composition
        id="WidgeteersFoodFinal"
        component={FoodEpisode}
        durationInFrames={Math.round(
          foodTimeline.duration_seconds * foodTimeline.fps,
        )}
        fps={foodTimeline.fps}
        width={foodTimeline.width}
        height={foodTimeline.height}
        defaultProps={{}}
      />
      <Composition
        id="VectorRigTest"
        component={VectorRigTest}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
