import React from "react";

import { ExampleLeaderboard } from "../exampleLeaderboard/exampleLeaderboard";
import { ExampleMatchup } from "../exampleMatchup/exampleMatchup";
import { ExampleMatchupStats } from "../exampleMatchupStats/exampleMatchupStats";
import { HowToPlaySummaryPanel } from "./howToPlaySummaryPanel";
import { SignInLink } from "../signInLink/signInLink";

import { HowToPlayUtility } from "../../utilities/howToPlayUtility";
import { ImageUtility } from "../../utilities/imageUtility";

import { IMatchup } from "../../../stroll-models/matchup";

interface HowToPlaySummaryProps {
  
}

export const HowToPlaySummary: React.FC<HowToPlaySummaryProps> = (props: HowToPlaySummaryProps) => {
  const matchup: IMatchup = HowToPlayUtility.generateRandomExampleMatchup();

  return (
    <div className="how-to-play-summary">
      <div className="how-to-play-summary-header">
        <h1 className="how-to-play-summary-header-title passion-one-font">Fantasy sports style betting* meets step tracking.</h1>
        <p className="how-to-play-summary-header-description passion-one-font">Stroll The Dice is the combination of a stepping competition and a prediction game rolled into one.</p>
        <p className="how-to-play-summary-header-disclaimer passion-one-font">*With fantasy points. No real currency is exchanged.</p>
        <p className="how-to-play-summary-header-play-free-statement passion-one-font">Play free for your first 7 in-game days!</p>
        <SignInLink label="Get started" />
      </div>
      <div className="how-to-play-summary-panels">
        <HowToPlaySummaryPanel     
          text="Games last between 1 and 7 days with different matchups each day. Earn points by taking steps and beating your competitor."
          title="Play with up to 20 friends per game"
        >
          <ExampleMatchup matchup={matchup} />
        </HowToPlaySummaryPanel>      
        <HowToPlaySummaryPanel
          backgroundImage={ImageUtility.getGraphic("prediction", "png")}
          className="prediction-panel"
          text="Each player starts with 10,000 points to use for guessing matchup outcomes."
          title="Earn additional points by predicting matchup winners"
        />
        <HowToPlaySummaryPanel     
          text=""
          title="Real time matchup stat updates"
        >
          <ExampleMatchupStats />
        </HowToPlaySummaryPanel>
        <HowToPlaySummaryPanel
          backgroundImage={ImageUtility.getGraphic("winner", "png")}
          className="winner-panel"
          text=""
          title="Have the most points at the end of the game and you win!"
        >
          <ExampleLeaderboard />
        </HowToPlaySummaryPanel>
        <HowToPlaySummaryPanel
          text="Gain experience for each game you complete. Unlock new level badges and profile icons."
          title="Earn experience and level up!"
        >
          <div />
        </HowToPlaySummaryPanel>
      </div>
    </div>
  )
}