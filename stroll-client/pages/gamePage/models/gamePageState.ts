import { defaultGame, IGame } from "../../../../stroll-models/game";
import { IInvite } from "../../../../stroll-models/invite";
import { defaultPlayer, IPlayer } from "../../../../stroll-models/player";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageStateStatuses {
  game: RequestStatus;
  players: RequestStatus;
}

export const defaultGamePageStateStatuses = (): IGamePageStateStatuses => ({ 
  game: RequestStatus.Loading,
  players: RequestStatus.Idle
});

export interface IGamePageStateToggles {
  accept: boolean;
  events: boolean;
  invite: boolean;
  players: boolean;
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  accept: false,
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