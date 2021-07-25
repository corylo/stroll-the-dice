import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { MatchupSides } from "../matchupSides/matchupSides";
import { MyPrediction } from "../myPrediction/myPrediction";
import { PredictionModal } from "../predictionModal/predictionModal";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { GamePageContext } from "../../gamePage";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface MatchupProps {  
  matchup: IMatchup;
  predictions: IPrediction[];
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { state } = useContext(GamePageContext);

  const { matchup, predictions } = props;

  const myPrediction: IPrediction = PredictionUtility.getById(state.player.id, matchup.id, predictions);

  const dayStatus: GameStatus = GameDurationUtility.getDayStatus(matchup.day, state.day);

  const [toggled, setToggled] = useState<boolean>(false);

  const getPredictionModal = (): JSX.Element => {
    if(toggled) {
      return (  
        <PredictionModal 
          matchup={matchup}
          myPrediction={myPrediction}
          back={() => setToggled(false)} 
        />
      )
    }
  }

  const getMyPrediction = (): JSX.Element => {
    if(myPrediction) {      
      return (
        <MyPrediction 
          matchup={matchup} 
          myPrediction={myPrediction} 
        />
      )
    }
  }

  const getPredictionButton = (): JSX.Element => {
    if(PredictionUtility.matchupAvailable(matchup, state.day)) {
      return (
        <Button 
          className="toggle-prediction-button passion-one-font" 
          handleOnClick={() => setToggled(true)}
        >
          Predict
        </Button>
      )
    }
  }

  const getUpdateTimer = (): JSX.Element => {
    if(dayStatus === GameStatus.InProgress) {
      return (
        <div className="game-matchup-header">
          <UpdateTimer interval={0} />
        </div>
      )
    }
  }

  return (
    <div className="game-matchup">
      {getUpdateTimer()}
      <MatchupSides matchup={matchup} />
      {getMyPrediction()}    
      {getPredictionButton()}
      {getPredictionModal()}
    </div>
  );
}