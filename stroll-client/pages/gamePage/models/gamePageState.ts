import { IGame } from "../../../../stroll-models/game";
import { defaultGamePageStateToggles, IGamePageStateToggles } from "./gamePageStateToggles";
import { IInvite } from "../../../../stroll-models/invite";
import { IPlayer } from "../../../../stroll-models/player";

import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageState {
  game: IGame;
  gameStatus: GameStatus;
  invite: IInvite;
  message: string;
  players: IPlayer[];
  status: RequestStatus;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  game: null,
  gameStatus: GameStatus.Unknown,
  invite: null,
  message: "",
  players: [],
  status: RequestStatus.Loading,
  toggles: defaultGamePageStateToggles()
});