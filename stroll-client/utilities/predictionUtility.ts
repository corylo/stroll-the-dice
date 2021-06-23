import firebase from "firebase/app";

import { MatchupUtility } from "./matchupUtility";

import { IMatchup } from "../../stroll-models/matchup";
import { IPrediction } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";
import { IPlayer } from "../../stroll-models/player";

interface IPredictionUtility {  
  enabled: (creator: IPlayer, matchup: IMatchup, playerID: string, myPrediction: IPrediction) => boolean;
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]) => IPrediction;
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
  mapUpdate: (amount: number, prediction: IPrediction) => IPredictionUpdate;
}

export const PredictionUtility: IPredictionUtility = {
  enabled: (creator: IPlayer, matchup: IMatchup, playerID: string, myPrediction: IPrediction): boolean => {
    return !MatchupUtility.findPlayer(creator, matchup) &&
      (myPrediction === null || myPrediction.ref.player === playerID);
  },
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]): IPrediction => {
    return predictions.find((prediction: IPrediction) => prediction.ref.matchup === matchupID && prediction.id === creatorID) || null;
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