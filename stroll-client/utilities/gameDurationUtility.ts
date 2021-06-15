import { GameDuration } from "../../stroll-enums/gameDuration";

interface IGameDurationUtility {
  getDurations: () => GameDuration[];
  getLabel: (duration: GameDuration) => string;
  getShortLabel: (duration: GameDuration) => string;
}

export const GameDurationUtility: IGameDurationUtility = {
  getDurations: (): GameDuration[] => {
    return [
      GameDuration.OneDay,
      GameDuration.ThreeDay,
      GameDuration.OneWeek,
      GameDuration.OneMonth
    ]
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