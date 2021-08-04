import { IGameEvent } from "./gameEvent";

export interface IPlayerCreatedEvent extends IGameEvent {
  playerID: string;
}