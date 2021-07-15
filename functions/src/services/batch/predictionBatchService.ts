import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { PredictionUtility } from "../../utilities/predictionUtility";

import { IMatchup } from "../../../../stroll-models/matchup";
import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { InitialValue } from "../../../../stroll-enums/initialValue";

interface IPredictionBatchService {  
  createInitialPrediction: (batch: firebase.firestore.WriteBatch, gameID: string, matchupID: string, playerID: string) => void;
  createInitialPredictions: (batch: firebase.firestore.WriteBatch, gameID: string, matchups: IMatchup[]) => void;  
}

export const PredictionBatchService: IPredictionBatchService = {
  createInitialPrediction: (batch: firebase.firestore.WriteBatch, gameID: string, matchupID: string, playerID: string): void => {
    const prediction: IPrediction = PredictionUtility.mapCreate(
      InitialValue.InitialPredictionPoints, 
      playerID,
      gameID,
      matchupID,
      playerID
    );

    const predictionRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(prediction.ref.game)
      .collection("matchups")
      .doc(prediction.ref.matchup)
      .collection("predictions")
      .doc(prediction.ref.creator)
      .withConverter(predictionConverter);
      
    batch.set(predictionRef, prediction);
  },
  createInitialPredictions: (batch: firebase.firestore.WriteBatch, gameID: string, matchups: IMatchup[]): void => {     
    matchups.forEach((matchup: IMatchup) => { 
      PredictionBatchService.createInitialPrediction(batch, gameID, matchup.id, matchup.left.profile.uid);
      
      PredictionBatchService.createInitialPrediction(batch, gameID, matchup.id, matchup.right.profile.uid);
    });
  }
}