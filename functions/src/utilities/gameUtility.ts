import { IGame } from "../../../stroll-models/game";

interface IGameUtility {
  hasChanged: (before: IGame, after: IGame) => boolean;
}

export const GameUtility: IGameUtility = {  
  hasChanged: (before: IGame, after: IGame): boolean => {
    return (
      before.name !== after.name ||
      !before.startsAt.isEqual(after.startsAt)
    );
  }
}