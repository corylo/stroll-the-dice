import { IGameDayHistoryEntry } from "./gameDayHistoryEntry";

export interface IGameDayHistoryUseEntry extends IGameDayHistoryEntry {
  gameID: string;
  usedBy: string;
}