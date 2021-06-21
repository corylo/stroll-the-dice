import React from "react";

import { MatchupSide } from "./matchupSide";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IProfile } from "../../../../../stroll-models/profile";

interface MatchupProps {  
  matchup: IMatchup;
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => {    
  const { matchup } = props;

  const getRightProfile = (): IProfile => {
    if(matchup.right.ref !== "" && matchup.right.player !== null) {
      return matchup.right.player.profile;
    }
  }

  return (
    <div className="game-matchup">
      <MatchupSide profile={matchup.left.player.profile} />
      <h1 className="game-matchup-vs-label passion-one-font">VS</h1>
      <MatchupSide profile={getRightProfile()} />
    </div>
  );
}