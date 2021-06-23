import firebase from "firebase/app";

import { IPrediction } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionUtility {  
  getById: (creatorID: string, predictions: IPrediction[]) => IPrediction;
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
  mapUpdate: (amount: number, prediction: IPrediction) => IPredictionUpdate;
}

export const PredictionUtility: IPredictionUtility = {
  getById: (creatorID: string, predictions: IPrediction[]): IPrediction => {
    return predictions.find((prediction: IPrediction) => prediction.id === creatorID) || null;
  },
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string): IPrediction => {
    return {
      amount,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      id: "",
      ref: {
        creator: creatorID,
        game: gameID,
        matchup: matchupID,
        player: playerID
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  },
  mapUpdate: (amount: number, prediction: IPrediction): IPredictionUpdate => {
    return {
      amount: prediction.amount + amount,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }
  }
}