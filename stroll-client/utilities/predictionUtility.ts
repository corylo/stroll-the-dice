import firebase from "firebase/app";

import { FirestoreDateUtility } from "../../stroll-utilities/firestoreDateUtility";
import { MatchupUtility } from "./matchupUtility";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";
import { IPrediction } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionUtility {    
  enabled: (playerID: string, myPrediction: IPrediction) => boolean;
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]) => IPrediction;
  getPayoutAmount: (amount: number, matchup: IMatchup) => number;
  getPredictionsCloseAt: (matchup: IMatchup, startsAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;  
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
  mapUpdate: (amount: number, prediction: IPrediction) => IPredictionUpdate;
  matchupAvailable: (matchup: IMatchup) => boolean;
  matchupSideAvailable: (matchup: IMatchup, side: IMatchupSide, player: IPlayer, myPrediction: IPrediction) => boolean;
  predictionsAvailableForDay: (matchup: IMatchup, startsAt: firebase.firestore.FieldValue) => boolean;  
}

export const PredictionUtility: IPredictionUtility = {  
  enabled: (playerID: string, myPrediction: IPrediction): boolean => {
    return myPrediction === null || myPrediction.ref.player === playerID;
  },
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]): IPrediction => {
    return predictions.find((prediction: IPrediction) => prediction.ref.matchup === matchupID && prediction.id === creatorID) || null;
  },
  getPayoutAmount: (amount: number, matchup: IMatchup): number => {
    return Math.round(amount * MatchupUtility.getWinnerOdds(matchup));
  },
  getPredictionsCloseAt: (matchup: IMatchup, startsAt: firebase.firestore.FieldValue): firebase.firestore.FieldValue => {
    const daysAsMillis: number = FirestoreDateUtility.daysToMillis(matchup.day - 1),
      oneHourAsMillis: number = 3600 * 1000;

    return FirestoreDateUtility.addMillis(startsAt, daysAsMillis + oneHourAsMillis)
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
  },
  matchupAvailable: (matchup: IMatchup): boolean => {  
    return matchup.left.playerID !== "" && matchup.right.playerID !== "";
  },
  matchupSideAvailable: (matchup: IMatchup, side: IMatchupSide, player: IPlayer, myPrediction: IPrediction): boolean => {
    const isInMatchup: boolean = MatchupUtility.playerIsInMatchup(player, matchup);
    
    const ifMyMatchupThenOnlyMe: boolean = isInMatchup ? side.playerID === player.id : true,
      onlyTheSideIvePredicted: boolean = myPrediction === null || myPrediction.ref.player === side.playerID;

    return (
      ifMyMatchupThenOnlyMe && 
      onlyTheSideIvePredicted
    );
  },
  predictionsAvailableForDay: (matchup: IMatchup, startsAt: firebase.firestore.FieldValue): boolean => {
    const predictionsCloseAt: firebase.firestore.FieldValue = PredictionUtility.getPredictionsCloseAt(matchup, startsAt);

    return !FirestoreDateUtility.lessThanOrEqualToNow(predictionsCloseAt);
  }
}