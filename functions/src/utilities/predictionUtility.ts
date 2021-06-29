import { MatchupUtility } from "./matchupUtility";

import { IMatchup } from "../../../stroll-models/matchup";
import { IPrediction } from "../../../stroll-models/prediction";

interface IPredictionUtility {
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]) => boolean;
  determinePayoutForPlayer: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]) => number;
  getByPlayer: (playerID: string, predictions: IPrediction[]) => IPrediction[];
  getCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => IPrediction[];
  sumCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]) => number;
}

export const PredictionUtility: IPredictionUtility = {
  determineIfCorrect: (prediction: IPrediction, matchups: IMatchup[]): boolean => {
    const matchup: IMatchup = MatchupUtility.getByPrediction(prediction.ref.matchup, matchups);

    return matchup.winner === prediction.ref.player;
  },
  determinePayoutForPlayer: (playerID: string, matchups: IMatchup[], allPredictions: IPrediction[]): number => {
    const predictions: IPrediction[] = PredictionUtility.getByPlayer(playerID, allPredictions),
      correctPredictions: IPrediction[] = PredictionUtility.getCorrectPredictions(predictions, matchups);

    return PredictionUtility.sumCorrectPredictions(correctPredictions, matchups);
  },
  getByPlayer: (playerID: string, predictions: IPrediction[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => prediction.ref.creator === playerID);
  },
  getCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]): IPrediction[] => {
    return predictions.filter((prediction: IPrediction) => PredictionUtility.determineIfCorrect(prediction, matchups));
  },
  sumCorrectPredictions: (predictions: IPrediction[], matchups: IMatchup[]): number => {
    let sum: number = 0;

    predictions.forEach((prediction: IPrediction) => {
      const matchup: IMatchup = MatchupUtility.getByPrediction(prediction.ref.matchup, matchups);

      sum += (prediction.amount * MatchupUtility.getWinnerOdds(matchup));
    });

    return sum;
  }
}