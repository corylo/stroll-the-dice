import { MatchupUtility } from "./matchupUtility";
import { PredictionUtility } from "./predictionUtility";

import { IGameDaySummary, IGameDaySummaryPlayerReference } from "../../../stroll-models/gameDaySummary";
import { IMatchup } from "../../../stroll-models/matchup";
import { IPlayerDayCompletedSummary } from "../../../stroll-models/playerDayCompletedSummary";
import { IPlayerStepUpdate } from "../../../stroll-models/playerStepUpdate";
import { IPrediction } from "../../../stroll-models/prediction";

interface IGameDaySummaryUtility {
  findUpdateForPlayer: (playerID: string, updates: IPlayerStepUpdate[]) => number;
  getPlayersFromMatchups: (matchups: IMatchup[]) => IGameDaySummaryPlayerReference[];
  mapCreate: (day: number, matchups: IMatchup[]) => IGameDaySummary;
  mapPlayerDayCompletedSummary: (day: number, playerID: string, matchups: IMatchup[], predictions: IPrediction[]) => IPlayerDayCompletedSummary;
  mapUpdates: (summary: IGameDaySummary, updates: IPlayerStepUpdate[]) => IGameDaySummary;
  mapWinners: (summary: IGameDaySummary) => IGameDaySummary;
}

export const GameDaySummaryUtility: IGameDaySummaryUtility = {  
  findUpdateForPlayer: (playerID: string, updates: IPlayerStepUpdate[]): number => {
    const match: IPlayerStepUpdate = updates.find((update: IPlayerStepUpdate) => update.id === playerID);

    return match ? match.steps : 0;
  },
  getPlayersFromMatchups: (matchups: IMatchup[]): IGameDaySummaryPlayerReference[] => {
    const references: IGameDaySummaryPlayerReference[] = [];

    matchups.forEach((matchup: IMatchup) => {
      if(matchup.left.playerID !== "") {
        references.push({ id: matchup.left.playerID, steps: 0 });
      }

      if(matchup.right.playerID !== "") {
        references.push({ id: matchup.right.playerID, steps: 0 });
      }
    });

    return references;
  },
  mapCreate: (day: number, matchups: IMatchup[]): IGameDaySummary => {    
    return {
      day,
      id: day.toString(),
      matchups,
      players: GameDaySummaryUtility.getPlayersFromMatchups(matchups)
    }
  },
  mapPlayerDayCompletedSummary: (day: number, playerID: string, matchups: IMatchup[], predictions: IPrediction[]): IPlayerDayCompletedSummary => {
    const received: number = PredictionUtility.sumCorrectPredictionsWithOdds(playerID, matchups, predictions),
      correctlyWagered: number = PredictionUtility.sumCorrectPredictions(playerID, matchups, predictions),
      lost: number = PredictionUtility.sumIncorrectPredictions(playerID, matchups, predictions),
      wagered: number = correctlyWagered + lost,
      gained: number = received - correctlyWagered,
      net: number = gained - lost;

    const matchup: IMatchup = MatchupUtility.getByPlayer(playerID, matchups),
      steps: number = MatchupUtility.getPlayerSteps(playerID, matchup),
      overall: number = steps + net;

    return {
      day,
      gained,
      lost,
      overall,
      received,
      steps,  
      wagered
    }
  },
  mapUpdates: (summary: IGameDaySummary, updates: IPlayerStepUpdate[]): IGameDaySummary => {
    summary.players = summary.players.map((player: IGameDaySummaryPlayerReference) => {
      const update: number = GameDaySummaryUtility.findUpdateForPlayer(player.id, updates);

      return {
        ...player,
        steps: player.steps + update
      }
    });

    return summary;
  },
  mapWinners: (summary: IGameDaySummary): IGameDaySummary => {
    summary.matchups = summary.matchups.map((matchup: IMatchup) => {
      if(matchup.left.playerID !== "" && matchup.right.playerID !== "") {
        matchup.winner = MatchupUtility.getLeader(matchup);
      }

      return matchup;
    });

    return summary;
  }
}