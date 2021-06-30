import firebase from "firebase/app";

import { MatchupUtility } from "./matchupUtility";

import { IMatchup } from "../../stroll-models/matchup";
import { IPrediction } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionUtility {  
  enabled: (playerID: string, myPrediction: IPrediction) => boolean;
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]) => IPrediction;
  getPayoutAmount: (amount: number, matchup: IMatchup) => number;
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
  mapUpdate: (amount: number, prediction: IPrediction) => IPredictionUpdate;
}

export const PredictionUtility: IPredictionUtility = {
  enabled: (playerID: string, myPrediction: IPrediction): boolean => {
    return myPrediction === null || myPrediction.ref.player === playerID;
  },
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]): IPrediction => {
    return predictions.find((prediction: IPrediction) => prediction.ref.matchup === matchupID && prediction.id === creatorID) || null;
  },
  getPayoutAmount: (amount: number, matchup: IMatchup): number => {
    return amount * MatchupUtility.getWinnerOdds(matchup);
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