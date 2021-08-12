import firebase from "firebase-admin";

import { IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry";

import { GameDayHistoryEntryType } from "../../../stroll-enums/gameDayHistoryEntryType";

interface IGameDayHistoryUtility {
  mapCreate: (gameID: string, occurredAt: firebase.firestore.FieldValue, paymentID: string, quantity: number, redeemedBy: string, type: GameDayHistoryEntryType) => IGameDayHistoryEntry;
}

export const GameDayHistoryUtility: IGameDayHistoryUtility = {  
  mapCreate: (
    gameID: string, 
    occurredAt: firebase.firestore.FieldValue, 
    paymentID: string, 
    quantity: number, 
    redeemedBy: string, 
    type: GameDayHistoryEntryType
  ): IGameDayHistoryEntry => {
    return {
      gameID,
      id: "",
      occurredAt,
      paymentID,
      quantity,
      redeemedBy,
      type
    }
  }
}