import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IGamePageUtility {
  expandMatchupGroup: (gameStatus: GameStatus, day: number, currentDay: number, duration: number) => boolean;
}

export const GamePageUtility: IGamePageUtility = {
  expandMatchupGroup: (gameStatus: GameStatus, day: number, currentDay: number, duration: number): boolean => {
    console.log(day, currentDay, duration)

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