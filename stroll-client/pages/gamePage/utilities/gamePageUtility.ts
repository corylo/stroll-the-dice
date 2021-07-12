import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGamePageUtility {
  minimizeMatchupGroup: (gameStatus: GameStatus, day: number, currentDay: number, duration: number) => boolean;
}

export const GamePageUtility: IGamePageUtility = {
  minimizeMatchupGroup: (gameStatus: GameStatus, day: number, currentDay: number, duration: number): boolean => {
    if(gameStatus === GameStatus.Upcoming) {
      return day !== 1;
    } else if (gameStatus === GameStatus.Completed) {
      return day !== duration;
    }

    return day !== currentDay;
  }
}