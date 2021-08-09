import React, { useContext, useState } from "react";
import firebase from "firebase/app";

import { Button } from "../../../../components/buttons/button";
import { IconButton } from "../../../../components/buttons/iconButton";
import { Label } from "../../../../components/label/label";
import { MatchupSides } from "../matchupSides/matchupSides";
import { MyPrediction } from "../myPrediction/myPrediction";
import { PredictionModal } from "../predictionModal/predictionModal";
import { UpdateTimer } from "../../../../components/updateTimer/updateTimer";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";

interface MatchupProps {  
  matchup: IMatchup;
  predictions: IPrediction[];
}

export const Matchup: React.FC<MatchupProps> = (props: MatchupProps) => { 
  const { appState } = useContext(AppContext),
    { state } = useContext(GamePageContext);

  const { user } = appState;

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

  const getNoTrackerConnectedMessage = (): JSX.Element => {
    if(
      (matchup.left.playerID === user.profile.uid || matchup.right.playerID === user.profile.uid) &&
      user.profile.tracker === ""
    ) {
      return (
        <div className="no-tracker-connected-message-wrapper">
          <Label
            className="no-tracker-connected-message"
            icon="fal fa-exclamation-triangle"
            text="Your step tracker isn't connected"
          />
          <div className="game-action-button-wrapper">
            <IconButton
              className="game-action-button"
              icon="fal fa-arrow-right" 
              url="/profile"
            />
          </div>                
        </div>
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
      state.day === matchup.day &&
      state.game.progressUpdateAt && 
      !FirestoreDateUtility.endOfDayProgressUpdateComplete(matchup.day, state.game.startsAt, state.game.progressUpdateAt)
    ) {   
      const getText = (time: string): string => {
        const beginningOfHour: firebase.firestore.FieldValue = FirestoreDateUtility.beginningOfHour(state.game.progressUpdateAt),
          predictionsCloseAt: firebase.firestore.FieldValue = PredictionUtility.getPredictionsCloseAt(matchup, state.game.startsAt);
        
        if(PredictionUtility.predictionsAvailableForDay(matchup, state.game.startsAt) && FirestoreDateUtility.timestampToRelativeOfUnit(predictionsCloseAt, "M") <= 60) {
          return `Predictions close in ${time}`;
        } else if(FirestoreDateUtility.timestampToRelativeOfUnit(beginningOfHour, "M") >= 60) {
          return "Retrieving step updates";
        }

        return `Update in ${time}`;
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
      {getNoTrackerConnectedMessage()}
      {getMyPrediction()}    
      {getPredictionButton()}
      {getPredictionModal()}
    </div>
  );
}