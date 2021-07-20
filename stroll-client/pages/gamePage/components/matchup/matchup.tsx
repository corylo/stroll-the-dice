import React, { useContext } from "react";

import { MatchupSide, MatchupSideAlignment } from "../matchupSide/matchupSide";

import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { MyPrediction } from "../myPrediction/myPrediction";

interface MatchupProps {  
  dayStatus: GameStatus;
  matchup: IMatchup;
  predictions: IPrediction[];
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { player } = useContext(GamePageContext).state;

  const { dayStatus, matchup, predictions } = props;

  const myPrediction: IPrediction = PredictionUtility.getById(player.id, matchup.id, predictions);

  const getMyPrediction = (): JSX.Element => {
    if(myPrediction) {      
      return (
        <MyPrediction dayStatus={dayStatus} matchup={matchup} myPrediction={myPrediction} />
      )
    }
  }

  return (
    <div className="game-matchup">
      <div className="game-matchup-sides">
        <MatchupSide 
          alignment={MatchupSideAlignment.Left}
          dayStatus={dayStatus}
          matchup={matchup}
          myPrediction={myPrediction}
          odds={MatchupUtility.calculateOdds(matchup.left, matchup.right)} 
        />
        <h1 className="game-matchup-vs-label passion-one-font">VS</h1>
        <MatchupSide 
          alignment={MatchupSideAlignment.Right}
          dayStatus={dayStatus}
          matchup={matchup}
          myPrediction={myPrediction}
          odds={MatchupUtility.calculateOdds(matchup.right, matchup.left)} 
        />
      </div>
      {getMyPrediction()}
    </div>
  );
}