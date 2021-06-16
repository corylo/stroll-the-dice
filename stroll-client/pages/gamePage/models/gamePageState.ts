import { IGame } from "../../../../stroll-models/game";
import { defaultGamePageStateToggles, IGamePageStateToggles } from "./gamePageStateToggles"
import { IInvite } from "../../../../stroll-models/invite";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageState {
  game: IGame;
  invite: IInvite;
  message: string;
  status: RequestStatus;
  toggles: IGamePageStateToggles;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  game: null,
  invite: null,
  message: "",
  status: RequestStatus.Loading,
  toggles: defaultGamePageStateToggles()
});