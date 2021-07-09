import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { PredictionUtility } from "../../utilities/predictionUtility";

import { IPrediction, predictionConverter } from "../../../../stroll-models/prediction";

import { InitialValue } from "../../../../stroll-enums/initialValue";

interface IPredictionTransactionService {  
  createInitialPrediction: (transaction: firebase.firestore.Transaction, gameID: string, matchupID: string, playerID: string) => void;  
  createInitialPredictions: (transaction: firebase.firestore.Transaction, gameID: string, matchupID: string, leftID: string, rightID: string) => void;  
}

export const PredictionTransactionService: IPredictionTransactionService = {
  createInitialPrediction: (transaction: firebase.firestore.Transaction, gameID: string, matchupID: string, playerID: string): void => {
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
      
    transaction.set(predictionRef, prediction);
  },
  createInitialPredictions: (transaction: firebase.firestore.Transaction, gameID: string, matchupID: string, leftID: string, rightID: string): void => {
    PredictionTransactionService.createInitialPrediction(transaction, gameID, matchupID, leftID);
      
    PredictionTransactionService.createInitialPrediction(transaction, gameID, matchupID, rightID);
  }
}