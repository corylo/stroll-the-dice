import firebase from "firebase-admin";

import { MatchupUtility } from "./matchupUtility";

import { IMatchup } from "../../../stroll-models/matchup";
import { IPrediction } from "../../../stroll-models/prediction";
import { IPlayer } from "../../../stroll-models/player";

import { InitialValue } from "../../../stroll-enums/initialValue";
import { MatchupLeader } from "../../../stroll-enums/matchupLeader";

interface IPredictionUtility {    
  adjustForInitialSelfPrediction: (playerID: string, predictions: IPrediction[]) => IPrediction[];
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]) => boolean;        
  determineNewAvailablePoints: (player: IPlayer, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  determineNewTotalPoints: (player: IPlayer, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
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
  adjustForInitialSelfPrediction: (playerID: string, predictions: IPrediction[]): IPrediction[] => {
    return predictions.map((prediction: IPrediction) => {
      if(prediction.ref.player === playerID) {
        prediction.amount = prediction.amount - InitialValue.InitialPredictionPoints;
      }

      return prediction;
    });
  },
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]): boolean => {
    const matchup: IMatchup = MatchupUtility.getByID(prediction.ref.matchup, matchups);

    if(matchup.winner !== "" && matchup.winner !== MatchupLeader.Tie) {
      return matchup.winner === prediction.ref.player;
    }
    
    return true;
  },
  determineNewAvailablePoints: (player: IPlayer, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const grossPayout: number = PredictionUtility.sumCorrectPredictionsWithOdds(player.id, matchups, allPredictions);

    return player.points.available + grossPayout;
  },
  determineNewTotalPoints: (player: IPlayer, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const grossPayout: number = PredictionUtility.sumCorrectPredictionsWithOdds(player.id, matchups, allPredictions),
      correctlyWagered: number = PredictionUtility.sumCorrectPredictions(player.id, matchups, allPredictions),
      incorrectlyWagered: number = PredictionUtility.sumIncorrectPredictions(player.id, matchups, allPredictions);
    
    const netPayout: number = grossPayout - correctlyWagered;

    return player.points.total + netPayout - incorrectlyWagered;
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
      correctPredictions: IPrediction[] = PredictionUtility.adjustForInitialSelfPrediction(playerID, PredictionUtility.getCorrectPredictions(predictions, matchups))

    return PredictionUtility.sumPredictions(correctPredictions);    
  },
  sumCorrectPredictionsWithOdds: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumPredictionsWithOdds(correctPredictions, matchups);
  },
  sumIncorrectPredictions: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      incorrectPredictions: IPrediction[] = PredictionUtility.adjustForInitialSelfPrediction(playerID, PredictionUtility.getIncorrectPredictions(predictions, matchups))

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