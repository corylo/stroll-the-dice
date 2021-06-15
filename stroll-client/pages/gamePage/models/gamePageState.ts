import { IGame } from "../../../../stroll-models/game";
import { defaultGamePageStateToggles, IGamePageStateToggles } from "./gamePageStateToggles"

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageState {
  game: IGame;
  message: string;
  status: RequestStatus;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  game: null,
  message: "",
  status: RequestStatus.Loading,
  toggles: defaultGamePageStateToggles()
});