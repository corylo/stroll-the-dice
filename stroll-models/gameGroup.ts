import { IGame } from "./game";

import { GroupGameBy } from "../stroll-enums/groupGameBy";
import { GameStatus } from "../stroll-enums/gameStatus";
import { RequestStatus } from "../stroll-enums/requestStatus";

export interface IGameGroup {
  games: IGame[];
  gameStatus: GameStatus;
  groupBy: GroupGameBy;
  requestStatus: RequestStatus;
}