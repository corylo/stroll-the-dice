import React from "react";

import { MatchupSide, MatchupSideAlignment } from "../matchupSide/matchupSide";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";

interface MatchupProps {  
  matchup: IMatchup;
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { matchup } = props;

  return (
    <div className="game-matchup">
      <MatchupSide 
        alignment={MatchupSideAlignment.Left}
        matchup={matchup}
        odds={MatchupUtility.calculateOdds(matchup.left, matchup.right)} 
      />
      <h1 className="game-matchup-vs-label passion-one-font">VS</h1>
      <MatchupSide 
        alignment={MatchupSideAlignment.Right}
        matchup={matchup}
        odds={MatchupUtility.calculateOdds(matchup.right, matchup.left)} 
      />
    </div>
  );
}