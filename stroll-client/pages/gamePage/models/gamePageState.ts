import { IGame } from "../../../../stroll-models/game";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IGamePageState {
  game: IGame;
  message: string;
  status: RequestStatus;
}

export const defaultGamePageState = (): IGamePageState => ({ 
  game: null,
  message: "",
  status: RequestStatus.Loading
});