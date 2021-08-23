import firebase from "firebase-admin";

import { MatchupUtility } from "./matchupUtility";

import { IMatchup } from "../../../stroll-models/matchup";
import { IPrediction } from "../../../stroll-models/prediction";

import { MatchupLeader } from "../../../stroll-enums/matchupLeader";

interface IPredictionUtility {    
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]) => boolean;            
  getByPlayer: (playerID: string, predictions: IPrediction[]) => IPrediction[];
  getCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => IPrediction[];
  getIncorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => IPrediction[];    
  mapCreate: (amount: number, creatorID: string, gameID: string, matchupID: string, playerID: string) => IPrediction;    
  sumCorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;  
  sumCorrectPredictionsWithOdds: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  sumIncorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  sumPredictions: (predictions: IPrediction[]) => number;
  sumPredictionsWithOdds: (predictions: IPrediction[], matchups: IMatchup[]) => number;
}

export const PredictionUtility: IPredictionUtility = {
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]): boolean => {
    const matchup: IMatchup = MatchupUtility.getByID(prediction.ref.matchup, matchups);

    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === prediction.ref.player;
    }
    
    return false;
  },
  getByPlayer: (playerID: string, predictions: IPrediction[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => prediction.ref.creator === playerID);
  },
  getCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => PredictionUtility.determineIfCorrect(prediction, matchups));
  },
  getIncorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => !PredictionUtility.determineIfCorrect(prediction, matchups));
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
  sumCorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictions(correctPredictions);    
  },
  sumCorrectPredictionsWithOdds: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictionsWithOdds(correctPredictions, matchups);
  },
  sumIncorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      incorrectPredictions: IPrediction[] = PredictionUtility.getIncorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictions(incorrectPredictions);
  },
  sumPredictions: (predictions: IPrediction[]): number => {
    if(predictions.length > 0) {
      return predictions.reduce((sum: number, prediction: IPrediction) => sum + prediction.amount, 0);
    }

    return 0;
  },
  sumPredictionsWithOdds: (predictions: IPrediction[], matchups: IMatchup[]): number => {
    if(predictions.length > 0) {
      let sum: number = 0;
  
      predictions.forEach((prediction: IPrediction) => {
        const matchup: IMatchup = MatchupUtility.getByID(prediction.ref.matchup, matchups);

        sum += Math.round(prediction.amount * MatchupUtility.getWinnerOdds(matchup));
      });

      return sum;
    }

    return 0;
  }
}