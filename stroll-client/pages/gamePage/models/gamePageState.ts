import { defaultGame, IGame } from "../../../../stroll-models/game";
import { IInvite } from "../../../../stroll-models/invite";
import { defaultPlayer, IPlayer } from "../../../../stroll-models/player";

import { PlayerStatus } from "../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageStateStatuses {
  game: RequestStatus;
  player: PlayerStatus;
  players: RequestStatus;
}

export const defaultGamePageStateStatuses = (): IGamePageStateStatuses => ({ 
  game: RequestStatus.Loading,
  player: PlayerStatus.Loading,  
  players: RequestStatus.Loading
});

export interface IGamePageStateToggles {
  events: boolean;
  invite: boolean;
  players: boolean;
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  events: false,
  invite: false,
  players: false, 
  update: false
});

export interface IGamePageState {
  day: number;
  game: IGame;
  invite: IInvite;
  message: string;
  player: IPlayer;
  players: IPlayer[];
  statuses: IGamePageStateStatuses;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  day: 0,
  game: defaultGame(),
  invite: null,
  message: "",
  player: defaultPlayer(),
  players: [],
  statuses: defaultGamePageStateStatuses(),
  toggles: defaultGamePageStateToggles()
});