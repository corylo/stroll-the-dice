import firebase from "firebase-admin";

import { IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry/gameDayHistoryEntry";
import { IGameDayHistoryGiftEntry } from "../../../stroll-models/gameDayHistoryEntry/gameDayHistoryGiftEntry";
import { IGameDayHistoryPurchaseEntry } from "../../../stroll-models/gameDayHistoryEntry/gameDayHistoryPurchaseEntry";
import { IGameDayHistoryUseEntry } from "../../../stroll-models/gameDayHistoryEntry/gameDayHistoryUseEntry";

import { GameDayHistoryEntryType } from "../../../stroll-enums/gameDayHistoryEntryType";

interface IGameDayHistoryUtility {
  mapGameDayHistoryEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, type: GameDayHistoryEntryType) => IGameDayHistoryEntry;
  mapGameDayHistoryGiftEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, from: string, to: string) => IGameDayHistoryGiftEntry;
  mapGameDayHistoryPurchaseEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, paymentID: string) => IGameDayHistoryPurchaseEntry;
  mapGameDayHistoryUseEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, gameID: string, usedBy: string) => IGameDayHistoryUseEntry;  
}

export const GameDayHistoryUtility: IGameDayHistoryUtility = {  
  mapGameDayHistoryEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, type: GameDayHistoryEntryType): IGameDayHistoryEntry => {
    return {
      id: "",
      occurredAt,
      quantity,
      type
    }
  },
  mapGameDayHistoryGiftEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, from: string, to: string): IGameDayHistoryGiftEntry => {
    const entry: IGameDayHistoryEntry = GameDayHistoryUtility.mapGameDayHistoryEntry(occurredAt, quantity, GameDayHistoryEntryType.Gift);

    return {
      ...entry,
      from,
      to
    }
  },
  mapGameDayHistoryPurchaseEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, paymentID: string): IGameDayHistoryPurchaseEntry => {
    const entry: IGameDayHistoryEntry = GameDayHistoryUtility.mapGameDayHistoryEntry(occurredAt, quantity, GameDayHistoryEntryType.Purchase);

    return {
      ...entry,
      paymentID
    }
  },
  mapGameDayHistoryUseEntry: (occurredAt: firebase.firestore.FieldValue, quantity: number, gameID: string, usedBy: string): IGameDayHistoryUseEntry => {
    const entry: IGameDayHistoryEntry = GameDayHistoryUtility.mapGameDayHistoryEntry(occurredAt, quantity, GameDayHistoryEntryType.Use);

    return {
      ...entry,
      gameID,
      usedBy
    }
  }
}