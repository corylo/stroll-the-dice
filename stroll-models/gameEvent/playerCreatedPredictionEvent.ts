import { IGameEvent } from "./gameEvent";
import { IMatchupProfileReference } from "../matchupProfileReference";

export interface IPlayerCreatedPredictionEvent extends IGameEvent {
  amount: number;
  matchup: IMatchupProfileReference;
  playerID: string;
}