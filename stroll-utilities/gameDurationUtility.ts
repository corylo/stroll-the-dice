import { DateUtility } from "./dateUtility";
import { FirestoreDateUtility } from "./firestoreDateUtility";

import { IGame } from "../stroll-models/game";

import { GameDuration } from "../stroll-enums/gameDuration";

interface IGameDurationUtility {
  completed: (game: IGame) => boolean;
  hasDayPassed: (game: IGame) => boolean;
  getDay: (game: IGame) => number;
  getDurations: () => GameDuration[];  
  getEndsAt: (game: IGame) => number;
  getTimeRemaining: (game: IGame) => string;
  getLabel: (duration: GameDuration) => string;
  getShortLabel: (duration: GameDuration) => string;
}

export const GameDurationUtility: IGameDurationUtility = {
  completed: (game: IGame): boolean => {   
    return DateUtility.lessThanOrEqualToNow(GameDurationUtility.getEndsAt(game));
  },
  hasDayPassed: (game: IGame): boolean => {
    const date: Date = FirestoreDateUtility.timestampToDate(game.startsAt),
      diff: number = date.getTime() - Date.now(),
      hours: number = Math.floor(diff / (3600 * 1000));

    return hours % 24 === 0;
  },
  getDay: (game: IGame): number => {
    if(FirestoreDateUtility.lessThanOrEqualToNow(game.startsAt)) {
      const diff: number = Math.floor(Math.abs(FirestoreDateUtility.diffInDays(game.startsAt)));

      return diff + 1;
    }

    return 0;
  },
  getDurations: (): GameDuration[] => {
    return [
      GameDuration.ThreeDay,
      GameDuration.OneWeek,
      GameDuration.TwoWeek,
      GameDuration.OneMonth
    ]
  },
  getEndsAt: (game: IGame): number => {
    const end: number = DateUtility.daysToMillis(game.duration) / 1000,
      endsAt: number = FirestoreDateUtility.add(game.startsAt, end);

    return endsAt;
  },
  getTimeRemaining: (game: IGame): string => {    
    return DateUtility.secondsToRelative(GameDurationUtility.getEndsAt(game));
  },
  getLabel: (duration: GameDuration): string => {
    switch(duration) {
      case GameDuration.OneMonth:
        return "1 Month";
      case GameDuration.OneWeek:
        return "1 Week";
      case GameDuration.ThreeDay:
        return "3 Day";
      case GameDuration.TwoWeek:
        return "2 Week";
      default:
        throw new Error(`Unknown game duration: ${duration}`);
    }
  },
  getShortLabel: (duration: GameDuration): string => {
    switch(duration) {
      case GameDuration.OneMonth:
        return "1M";
      case GameDuration.OneWeek:
        return "1W";
      case GameDuration.ThreeDay:
        return "3D";
      case GameDuration.TwoWeek:
        return "2W";
      default:
        throw new Error(`Unknown game duration: ${duration}`);
    }
  }
}