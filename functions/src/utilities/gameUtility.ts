import { IGame } from "../../../stroll-models/game";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { IGameUpdate } from "../../../stroll-models/gameUpdate";

interface IGameUtility {
  hasReferenceFieldChanged: (before: IGame, after: IGame) => boolean;
  hasUpdateEventOccurred: (before: IGame, after: IGame) => boolean;
  inProgressToCompleted: (before: IGame, after: IGame) => boolean;
  mapUpdates: (before: IGame, after: IGame) => IGameUpdate;
  stillInProgress: (before: IGame, after: IGame) => boolean;
  upcomingToInProgress: (before: IGame, after: IGame) => boolean;
}

export const GameUtility: IGameUtility = {  
  hasReferenceFieldChanged: (before: IGame, after: IGame): boolean => {
    return (
      before.name !== after.name ||
      !before.startsAt.isEqual(after.startsAt) ||
      !before.endsAt.isEqual(after.endsAt) ||
      before.status !== after.status
    );
  },
  hasUpdateEventOccurred: (before: IGame, after: IGame): boolean => {
    return (
      before.name !== after.name ||
      before.duration !== after.duration ||
      !before.startsAt.isEqual(after.startsAt) ||
      !before.endsAt.isEqual(after.endsAt)
    )
  },
  inProgressToCompleted: (before: IGame, after: IGame): boolean => {
    return (
      before.status === GameStatus.InProgress && 
      after.status === GameStatus.Completed
    )
  },
  mapUpdates: (before: IGame, after: IGame): IGameUpdate => {
    const updates: IGameUpdate = {};

    if(before.name !== after.name) {
      updates.name = after.name;
    }

    if(before.duration !== after.duration) {
      updates.duration = after.duration;
    }

    if(!before.startsAt.isEqual(after.startsAt)) {
      updates.startsAt = after.startsAt;
    }

    if(!before.endsAt.isEqual(after.endsAt)) {
      updates.endsAt = after.endsAt;
    }

    return updates;
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