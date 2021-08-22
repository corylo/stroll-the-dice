import { IGameDayHistoryEntry } from "./gameDayHistoryEntry";

export interface IGameDayHistoryPurchaseEntry extends IGameDayHistoryEntry {
  paymentID: string;
}