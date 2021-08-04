import { IGameEvent } from "./gameEvent";
import { IMatchupPlayerReference } from "../matchupProfileReference";

export interface IPlayerCreatedPredictionEvent extends IGameEvent {
  amount: number;
  matchup: IMatchupPlayerReference;
  playerID: string;
}