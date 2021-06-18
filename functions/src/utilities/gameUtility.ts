import { IGame } from "../../../stroll-models/game";

interface IGameUtility {
  hasStartsAtChanged: (before: IGame, after: IGame) => boolean;
}

export const GameUtility: IGameUtility = {  
  hasStartsAtChanged: (before: IGame, after: IGame): boolean => {
    return !after.startsAt.isEqual(before.startsAt);
  }
}