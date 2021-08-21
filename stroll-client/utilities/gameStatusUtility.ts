import { UrlUtility } from "./urlUtility";

import { GameStatus } from "../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../stroll-enums/groupGameBy";

interface IGameStatusUtility {
  getGroupByFromQueryParam: (param: string) => GroupGameBy;
  getStatusFromQueryParam: (param: string) => GameStatus;
}

export const GameStatusUtility: IGameStatusUtility = {
  getGroupByFromQueryParam: (param: string): GroupGameBy => {
    if(param === null || param === "" || param === UrlUtility.format(GroupGameBy.Hosting)) {
      return GroupGameBy.Hosting;
    } else if (param === UrlUtility.format(GroupGameBy.Joined)) {
      return GroupGameBy.Joined;
    }
  },
  getStatusFromQueryParam: (param: string): GameStatus => {
    if(param === null || param === "" || param === UrlUtility.format(GameStatus.InProgress)) {
      return GameStatus.InProgress;
    } else if (param === UrlUtility.format(GameStatus.Upcoming)) {
      return GameStatus.Upcoming;
    } else if (param === UrlUtility.format(GameStatus.Completed)) {
      return GameStatus.Completed;
    }
  }
}