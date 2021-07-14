import { IGameEvent } from "./gameEvent";
import { IGameUpdate } from "../gameUpdate";

export interface IGameUpdateEvent extends IGameEvent {
  before: IGameUpdate;
  after: IGameUpdate;
}