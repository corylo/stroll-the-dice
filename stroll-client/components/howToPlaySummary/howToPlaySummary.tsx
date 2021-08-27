import React from "react";

import { HowToPlaySummaryPanel } from "./howToPlaySummaryPanel";

import { ImageUtility } from "../../utilities/imageUtility";

interface HowToPlaySummaryProps {
  
}

export const HowToPlaySummary: React.FC<HowToPlaySummaryProps> = (props: HowToPlaySummaryProps) => {
  return (
    <div className="how-to-play-summary">
      <HowToPlaySummaryPanel
        backgroundImage={ImageUtility.getGraphic("game", "png")}
        text="Stroll The Dice is the combination of a stepping competition and a prediction game rolled into one."
        title="It's time to get strolling!"
      />
      <HowToPlaySummaryPanel
        backgroundImage={ImageUtility.getGraphic("matchup", "png")} 
        className="matchup-panel"
        text="Games last between 1 and 7 days with different matchups each day. Earn points by taking steps and beating your competitor."
        title="Get matched up head to head against your friends"
      />
      <HowToPlaySummaryPanel
        backgroundImage={ImageUtility.getGraphic("prediction", "png")}
        className="prediction-panel"
        text="Each player starts with 10,000 points to use for guessing matchup outcomes."
        title="Earn additional points by predicting matchup winners"
      />
      <HowToPlaySummaryPanel
        backgroundImage={ImageUtility.getGraphic("winner", "png")}
        className="winner-panel"
        text=""
        title="Have the most points at the end of the game and you win!"
      />
    </div>
  )
}