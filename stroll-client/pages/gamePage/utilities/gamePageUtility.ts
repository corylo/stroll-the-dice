import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGamePageUtility {
  expandGameDay: (gameStatus: GameStatus, day: number, currentDay: number, duration: number) => boolean;
}

export const GamePageUtility: IGamePageUtility = {
  expandGameDay: (gameStatus: GameStatus, day: number, currentDay: number, duration: number): boolean => {
    if(gameStatus === GameStatus.Upcoming) {
      return day === 1;
    } else if (gameStatus === GameStatus.InProgress) {
      return day === currentDay;
    } else if (currentDay <= duration + 1) {
      return day === duration
    }

    return false;
  }
}