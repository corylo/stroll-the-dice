import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { MatchupSides } from "../matchupSides/matchupSides";
import { MyPrediction } from "../myPrediction/myPrediction";
import { PredictionModal } from "../predictionModal/predictionModal";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { ITimeThreshold } from "../../../../../stroll-models/timeThreshold";

interface MatchupProps {  
  matchup: IMatchup;
  predictions: IPrediction[];
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { state } = useContext(GamePageContext);

  const { matchup, predictions } = props;

  const myPrediction: IPrediction = PredictionUtility.getById(state.player.id, matchup.id, predictions);

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
    if(!FirestoreDateUtility.endOfDayProgressUpdateComplete(matchup.day, state.game.startsAt, state.game.progressUpdateAt)) {      
      const threshold: ITimeThreshold = {
        quantity: 60,
        timestamp: FirestoreDateUtility.beginningOfHour(state.game.progressUpdateAt),
        unit: "M"
      }
  
      return (
        <div className="game-matchup-header">
          <UpdateTimer 
            interval={0} 
            text="Retrieving step updates"
            textThreshold={threshold}
          />
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