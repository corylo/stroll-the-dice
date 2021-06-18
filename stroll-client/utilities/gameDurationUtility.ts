import { DateUtility } from "./dateUtility";
import { FirestoreDateUtility } from "./firestoreDateUtility";

import { IGame } from "../../stroll-models/game";

import { GameDuration } from "../../stroll-enums/gameDuration";
import { GameStatus } from "../../stroll-enums/gameStatus";

interface IGameDurationUtility {
  completed: (game: IGame) => boolean;
  getDurations: () => GameDuration[];  
  getEndsAt: (game: IGame) => number;
  getGameStatus: (game: IGame) => GameStatus;
  getTimeRemaining: (game: IGame) => string;
  getLabel: (duration: GameDuration) => string;
  getShortLabel: (duration: GameDuration) => string;
}

export const GameDurationUtility: IGameDurationUtility = {
  completed: (game: IGame): boolean => {   
    return DateUtility.inPast(GameDurationUtility.getEndsAt(game));
  },
  getDurations: (): GameDuration[] => {
    return [
      GameDuration.OneDay,
      GameDuration.ThreeDay,
      GameDuration.OneWeek,
      GameDuration.OneMonth
    ]
  },
  getEndsAt: (game: IGame): number => {
    const end: number = DateUtility.daysToMillis(game.duration) / 1000,
      endsAt: number = FirestoreDateUtility.add(game.startsAt, end);

    return endsAt;
  },
  getGameStatus: (game: IGame): GameStatus => {
    if(GameDurationUtility.completed(game)) {
      return GameStatus.Completed;
    } else if (FirestoreDateUtility.inPast(game.startsAt)) {
      return GameStatus.InProgress;
    }

    return GameStatus.Upcoming;
  },
  getTimeRemaining: (game: IGame): string => {    
    return DateUtility.secondsToRelative(GameDurationUtility.getEndsAt(game));
  },
  getLabel: (duration: GameDuration): string => {
    switch(duration) {
      case GameDuration.OneDay:
        return "1 Day";
      case GameDuration.OneMonth:
        return "1 Month";
      case GameDuration.OneWeek:
        return "1 Week";
      case GameDuration.ThreeDay:
        return "3 Day";
      default:
        throw new Error(`Unknown game duration: ${duration}`);
    }
  },
  getShortLabel: (duration: GameDuration): string => {
    switch(duration) {
      case GameDuration.OneDay:
        return "1D";
      case GameDuration.OneMonth:
        return "1M";
      case GameDuration.OneWeek:
        return "1W";
      case GameDuration.ThreeDay:
        return "3D";
      default:
        throw new Error(`Unknown game duration: ${duration}`);
    }
  }
}