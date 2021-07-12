import { IGame } from "./game";

import { GroupGameBy } from "../stroll-enums/groupGameBy";

export interface IGameGroup {
  games: IGame[];
  groupBy: GroupGameBy;
}