import { IGameGroup } from "../../../../stroll-models/gameGroup";

import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../../../stroll-enums/groupGameBy";

interface IGameGroupUtility {
  getAllEmptyMessage: (status: GameStatus) => string;
  getEmptyMessage: (groupBy: GroupGameBy, status: GameStatus) => string;
  getInitialGroups: () => IGameGroup[];
}

export const GameGroupUtility: IGameGroupUtility = {
  getAllEmptyMessage: (status: GameStatus): string => {
    switch(status) {
      case GameStatus.Upcoming:
        return "You don't have any upcoming games.";
      case GameStatus.InProgress:
        return "You don't have any games in progress.";            
      case GameStatus.Completed:
        return "You don't have any completed games.";
      default:
        throw new Error(`Invalid game status: ${status}`);
    }
  },
  getEmptyMessage: (groupBy: GroupGameBy, status: GameStatus): string => {
    switch(groupBy) {
      case GroupGameBy.Hosting:
        if(status === GameStatus.Upcoming) {
          return "You aren't hosting any upcoming games yet.";
        } else if (status === GameStatus.InProgress) {
          return "You aren't hosting any games in progress yet.";
        } else if (status === GameStatus.Completed) {
          return "You haven't hosted any completed games yet.";
        }
      case GroupGameBy.Joined:
        if(status === GameStatus.Upcoming) {
          return "You haven't joined any upcoming games yet.";
        } else if (status === GameStatus.InProgress) {
          return "You haven't joined any games in progress yet.";
        } else if (status === GameStatus.Completed) {
          return "You haven't joined any completed games yet.";
        }
      default:
        throw new Error(`Invalid groupBy: ${groupBy}`);
    }
  },
  getInitialGroups: (): IGameGroup[] => {
    return [
      { games: [], groupBy: GroupGameBy.Hosting },
      { games: [], groupBy: GroupGameBy.Joined }
    ];
  }
}