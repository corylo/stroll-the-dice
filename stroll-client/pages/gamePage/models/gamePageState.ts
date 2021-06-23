import { IGame } from "../../../../stroll-models/game";
import { defaultGamePageStateToggles, IGamePageStateToggles } from "./gamePageStateToggles";
import { IInvite } from "../../../../stroll-models/invite";
import { IMatchup } from "../../../../stroll-models/matchup";
import { defaultPlayer, IPlayer } from "../../../../stroll-models/player";
import { IPrediction } from "../../../../stroll-models/prediction";

import { GameStatus } from "../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageState {
  day: number;
  game: IGame;
  gameStatus: GameStatus;
  invite: IInvite;
  matchups: IMatchup[];
  message: string;
  player: IPlayer;
  players: IPlayer[];
  predictions: IPrediction[];
  status: RequestStatus;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  day: 0,
  game: null,
  gameStatus: GameStatus.Unknown,
  invite: null,
  matchups: [],
  message: "",
  player: defaultPlayer(),
  players: [],
  predictions: [],
  status: RequestStatus.Loading,
  toggles: defaultGamePageStateToggles()
});