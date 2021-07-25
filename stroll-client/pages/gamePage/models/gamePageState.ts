import { defaultGame, IGame } from "../../../../stroll-models/game";
import { IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IInvite } from "../../../../stroll-models/invite";
import { defaultPlayer, IPlayer } from "../../../../stroll-models/player";

import { GameEventCategory } from "../../../../stroll-enums/gameEventCategory";
import { PlayerStatus } from "../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageStateFilters {
  eventCategory: GameEventCategory;
}

export const defaultGamePageStateFilters = (): IGamePageStateFilters => ({ 
  eventCategory: GameEventCategory.Game
});

export interface IGamePageStateStatuses {
  events: RequestStatus;
  game: RequestStatus;
  player: PlayerStatus;
  players: RequestStatus;
}

export const defaultGamePageStateStatuses = (): IGamePageStateStatuses => ({ 
  events: RequestStatus.Loading,
  game: RequestStatus.Loading,
  player: PlayerStatus.Loading,  
  players: RequestStatus.Idle
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
  events: IGameEvent[];
  filters: IGamePageStateFilters;
  game: IGame;
  invite: IInvite;
  message: string;
  player: IPlayer;
  playerSteps: number;
  players: IPlayer[];
  statuses: IGamePageStateStatuses;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  day: 0,
  events: [],
  filters: defaultGamePageStateFilters(),
  game: defaultGame(),
  invite: null,
  message: "",
  player: defaultPlayer(),
  playerSteps: 0,
  players: [],
  statuses: defaultGamePageStateStatuses(),
  toggles: defaultGamePageStateToggles()
});