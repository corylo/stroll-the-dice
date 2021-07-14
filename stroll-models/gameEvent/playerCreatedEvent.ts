import { IGameEvent } from "./gameEvent";
import { IProfileReference } from "../profileReference";

export interface IPlayerCreatedEvent extends IGameEvent {
  profile: IProfileReference;
}