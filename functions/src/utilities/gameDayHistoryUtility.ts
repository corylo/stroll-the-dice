import firebase from "firebase-admin";

import { IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry";

import { GameDayHistoryEntryType } from "../../../stroll-enums/gameDayHistoryEntryType";

interface IGameDayHistoryUtility {
  mapCreate: (occurredAt: firebase.firestore.FieldValue, quantity: number, redeemedBy: string, type: GameDayHistoryEntryType) => IGameDayHistoryEntry;
}

export const GameDayHistoryUtility: IGameDayHistoryUtility = {  
  mapCreate: (occurredAt: firebase.firestore.FieldValue, quantity: number, redeemedBy: string, type: GameDayHistoryEntryType): IGameDayHistoryEntry => {
    return {
      id: "",
      occurredAt,
      quantity,
      redeemedBy,
      type
    }
  }
}