import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface IGameUtility {
  hasReferenceFieldChanged: (before: IGame, after: IGame) => boolean;
  inProgressToCompleted: (before: IGame, after: IGame) => boolean;
  stillInProgress: (before: IGame, after: IGame) => boolean;
  upcomingToInProgress: (before: IGame, after: IGame) => boolean;
}

export const GameUtility: IGameUtility = {  
  hasReferenceFieldChanged: (before: IGame, after: IGame): boolean => {
    return (
      before.name !== after.name ||
      !before.startsAt.isEqual(after.startsAt) ||
      before.status !== after.status
    );
  },
  inProgressToCompleted: (before: IGame, after: IGame): boolean => {
    return (
      before.status === GameStatus.InProgress && 
      after.status === GameStatus.Completed
    )
  },
  stillInProgress: (before: IGame, after: IGame): boolean => {
    if(before.progressUpdateAt && after.progressUpdateAt) {
      return !before.progressUpdateAt.isEqual(after.progressUpdateAt);
    }

    return false;
  },
  upcomingToInProgress: (before: IGame, after: IGame): boolean => {
    return (
      before.status === GameStatus.Upcoming && 
      after.status === GameStatus.InProgress
    )
  }
}