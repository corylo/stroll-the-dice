import firebase from "firebase-admin";

import { FirestoreDateUtility } from "./firestoreDateUtility";
import { MatchupUtility } from "./matchupUtility";

import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IPrediction } from "../../../stroll-models/prediction";

import { MatchupLeader } from "../../../stroll-enums/matchupLeader";

interface IPredictionUtility {    
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]) => boolean;   
  determineIfPredictionsJustClosed: (day: number, game: IGame) => boolean;          
  getByPlayer: (playerID: string, predictions: IPrediction[]) => IPrediction[];
  filterOutRefundedPredictions: (predictions: IPrediction[]) => IPrediction[];
  getCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => IPrediction[];
  getIncorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => IPrediction[];    
  getPredictionsCloseAt: (day: number, startsAt: firebase.firestore.FieldValue) => firebase.firestore.FieldValue;  
  sumCorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;  
  sumCorrectPredictionsWithReturnRatio: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  sumIncorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  sumOneSidedPredictions: (playerID: string, predictions: IPrediction[]) => number;
  sumPredictions: (predictions: IPrediction[]) => number;
  sumPredictionsWithReturnRatio: (predictions: IPrediction[], matchups: IMatchup[]) => number;
}

export const PredictionUtility: IPredictionUtility = {
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]): boolean => {
    const matchup: IMatchup = MatchupUtility.getByID(prediction.ref.matchup, matchups);

    if(matchup.spreadWinner !== "" && matchup.spreadWinner !== MatchupLeader.Tie) {
      return matchup.spreadWinner === prediction.ref.player;
    }
    
    return false;
  },
  determineIfPredictionsJustClosed: (day: number, game: IGame): boolean => {
    return (
      PredictionUtility.getPredictionsCloseAt(day, game.startsAt)
        .isEqual(FirestoreDateUtility.beginningOfHour(game.initializeProgressUpdateAt))
    )
  },
  filterOutRefundedPredictions: (predictions: IPrediction[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => !prediction.refundedAt);
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
  getPredictionsCloseAt: (day: number, startsAt: firebase.firestore.FieldValue): firebase.firestore.FieldValue => {
    const daysAsMillis: number = FirestoreDateUtility.daysToMillis(day),
      oneHourAsMillis: number = 3600 * 1000;

    return FirestoreDateUtility.addMillis(startsAt, daysAsMillis + oneHourAsMillis)
  },
  sumCorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.filterOutRefundedPredictions(PredictionUtility.getByPlayer(playerID, allPredictions)),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictions(correctPredictions);    
  },
  sumCorrectPredictionsWithReturnRatio: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.filterOutRefundedPredictions(PredictionUtility.getByPlayer(playerID, allPredictions)),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictionsWithReturnRatio(correctPredictions, matchups);
  },
  sumIncorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.filterOutRefundedPredictions(PredictionUtility.getByPlayer(playerID, allPredictions)),
      incorrectPredictions: IPrediction[] = PredictionUtility.getIncorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictions(incorrectPredictions);
  },
  sumOneSidedPredictions: (playerID: string, predictions: IPrediction[]): number => {
    const filteredPredictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, predictions);

    return PredictionUtility.sumPredictions(filteredPredictions);
  },
  sumPredictions: (predictions: IPrediction[]): number => {
    if(predictions.length > 0) {
      return predictions.reduce((sum: number, prediction: IPrediction) => sum + prediction.amount, 0);
    }

    return 0;
  },
  sumPredictionsWithReturnRatio: (predictions: IPrediction[], matchups: IMatchup[]): number => {
    if(predictions.length > 0) {
      let sum: number = 0;
  
      predictions.forEach((prediction: IPrediction) => {
        const matchup: IMatchup = MatchupUtility.getByID(prediction.ref.matchup, matchups);

        sum += Math.round(prediction.amount * MatchupUtility.getWinnerRatio(matchup));
      });

      return sum;
    }

    return 0;
  }
}