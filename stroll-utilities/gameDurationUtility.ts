import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";
import { FirestoreDateUtility } from "./firestoreDateUtility";

import { IGame } from "../stroll-models/game";

import { GameDuration } from "../stroll-enums/gameDuration";
import { GameStatus } from "../stroll-enums/gameStatus";

interface IGameDurationUtility {
  getDay: (game: IGame) => number;
  getDayStatus: (day: number, currentDay: number) => GameStatus;
  getDurations: () => GameDuration[];  
  getEndsAt: (startsAt: firebase.firestore.FieldValue, duration: number) => number;
  getOrderBy: (status: GameStatus) => "startsAt" | "endsAt";
  getOrderByDirection: (status: GameStatus) => "asc" | "desc";
  getLabel: (duration: GameDuration) => string;
  getShortLabel: (duration: GameDuration) => string;
  getTimeRemaining: (game: IGame) => string;
  getTimeRemainingInToday: (game: IGame, day: number) => string;
  hasDayPassed: (game: IGame) => boolean;
}

export const GameDurationUtility: IGameDurationUtility = {
  getDay: (game: IGame): number => {
    if(FirestoreDateUtility.lessThanOrEqualToNow(game.startsAt)) {
      const date: Date = FirestoreDateUtility.timestampToDate(game.startsAt),
        diff: number = Math.abs(date.getTime() - Date.now());

      return Math.floor(diff / (24 * 3600 * 1000)) + 1;
    }

    return 0;
  },
  getDayStatus: (day: number, currentDay: number): GameStatus => {
    if(day < currentDay) {
      return GameStatus.Completed;
    } else if(day === currentDay) {
      return GameStatus.InProgress;
    } else if (day > currentDay) {
      return GameStatus.Upcoming;
    }
  },
  getDurations: (): GameDuration[] => {
    return [
      GameDuration.ThreeDay,
      GameDuration.OneWeek,
      GameDuration.TwoWeek,
      GameDuration.OneMonth
    ]
  },
  getEndsAt: (startsAt: firebase.firestore.FieldValue, duration: number): number => {
    const end: number = DateUtility.daysToMillis(duration) / 1000,
      endsAt: number = FirestoreDateUtility.add(startsAt, end);

    return endsAt;
  },
  getOrderBy: (status: GameStatus): "startsAt" | "endsAt" => {
    if(status === GameStatus.InProgress || GameStatus.Completed) {
      return "endsAt";
    }

    return "startsAt";
  },
  getOrderByDirection: (status: GameStatus): "asc" | "desc" => {
    if(status === GameStatus.Completed) {
      return "desc";
    }

    return "asc"
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
  },
  getTimeRemaining: (game: IGame): string => {    
    return FirestoreDateUtility.timestampToRelative(game.endsAt);
  },
  getTimeRemainingInToday: (game: IGame, day: number): string => {
    const start: Date = FirestoreDateUtility.timestampToDate(game.startsAt),
      end: Date = new Date(start);

    end.setDate(start.getDate() + day);

    return DateUtility.secondsToRelative(end.getTime() / 1000);
  },
  hasDayPassed: (game: IGame): boolean => {
    const date: Date = FirestoreDateUtility.timestampToDate(game.startsAt),
      diff: number = Math.abs(date.getTime() - Date.now()),
      hours: number = Math.round(diff / (3600 * 1000));

    return hours >= 24 && hours % 24 === 0;
  }
}