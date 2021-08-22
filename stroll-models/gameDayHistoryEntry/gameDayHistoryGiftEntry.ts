import { IGameDayHistoryEntry } from "./gameDayHistoryEntry";

export interface IGameDayHistoryGiftEntry extends IGameDayHistoryEntry {
  from: string;
  to: string;
}