import React, { useContext, useState } from "react";
import firebase from "firebase/app";

import { Button } from "../../../../components/buttons/button";
import { MatchupSides } from "../matchupSides/matchupSides";
import { MyPrediction } from "../myPrediction/myPrediction";
import { PredictionModal } from "../predictionModal/predictionModal";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
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

  const myPrediction: IPrediction = PredictionUtility.getById(state.player.id, matchup.id, predictions),
    dayStatus: GameStatus = GameDurationUtility.getDayStatus(matchup.day, state.day);

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
    if(
      PredictionUtility.predictionsAvailableForDay(matchup, state.game.startsAt) &&
      PredictionUtility.matchupAvailable(matchup)
    ) {
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
    if(
      state.day > 0 && (
        dayStatus === GameStatus.InProgress ||
        (dayStatus === GameStatus.Completed && !FirestoreDateUtility.endOfDayProgressUpdateComplete(matchup.day, state.game.startsAt, state.game.progressUpdateAt))
      )
    ) {   
      const getText = (time: string): string => {
        if(state.game.progressUpdateAt) {
          const beginningOfHour: firebase.firestore.FieldValue = FirestoreDateUtility.beginningOfHour(state.game.progressUpdateAt),
            predictionsCloseAt: firebase.firestore.FieldValue = PredictionUtility.getPredictionsCloseAt(matchup, state.game.startsAt);
          
          if(PredictionUtility.predictionsAvailableForDay(matchup, state.game.startsAt) && FirestoreDateUtility.timestampToRelativeOfUnit(predictionsCloseAt, "M") <= 60) {
            return `Predictions close in ${time}`;
          } else if(FirestoreDateUtility.timestampToRelativeOfUnit(beginningOfHour, "M") >= 60) {
            return "Retrieving step updates";
          }
  
          return `Update in ${time}`;
        } else {
          return "Starting game";
        }        
      }
  
      return (
        <div className="game-matchup-header">
          <UpdateTimer 
            interval={0} 
            getText={getText}
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