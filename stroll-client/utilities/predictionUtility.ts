import firebase from "firebase/app";

import { MatchupUtility } from "./matchupUtility";

import { IMatchup, IMatchupSide } from "../../stroll-models/matchup";
import { IPlayer } from "../../stroll-models/player";
import { IPrediction } from "../../stroll-models/prediction";
import { IPredictionUpdate } from "../../stroll-models/predictionUpdate";

interface IPredictionUtility {    
  enabled: (playerID: string, myPrediction: IPrediction) => boolean;
  getById: (creatorID: string, matchupID: string, predictions: IPrediction[]) => IPrediction;
  getPayoutAmount: (amount: number, matchup: IMatchup) => number;
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;
  mapUpdate: (amount: number, prediction: IPrediction) => IPredictionUpdate;
  matchupAvailable: (matchup: IMatchup, day: number) => boolean;
  matchupSideAvailable: (matchup: IMatchup, side: IMatchupSide, player: IPlayer, myPrediction: IPrediction) => boolean;
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
  matchupAvailable: (matchup: IMatchup, day: number): boolean => {    
    const validDay: boolean = matchup.day > day,
      validMatchup: boolean = matchup.left.profile.uid !== "" && matchup.right.profile.uid !== "";

    return (
      validDay &&
      validMatchup
    );
  },
  matchupSideAvailable: (matchup: IMatchup, side: IMatchupSide, player: IPlayer, myPrediction: IPrediction): boolean => {
    const isInMatchup: boolean = MatchupUtility.playerIsInMatchup(player, matchup);
    
    const ifMyMatchupThenOnlyMe: boolean = isInMatchup ? side.profile.uid === player.id : true,
      onlyTheSideIvePredicted: boolean = myPrediction === null || myPrediction.ref.player === side.profile.uid;

    return (
      ifMyMatchupThenOnlyMe && 
      onlyTheSideIvePredicted
    );
  }
}