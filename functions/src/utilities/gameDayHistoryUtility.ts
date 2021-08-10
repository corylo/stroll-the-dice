import firebase from "firebase-admin";
import { IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry";

interface IGameDayHistoryUtility {
  mapCreate: (occurredAt: firebase.firestore.FieldValue, quantity: number, redeemedBy: string) => IGameDayHistoryEntry;
}

export const GameDayHistoryUtility: IGameDayHistoryUtility = {  
  mapCreate: (occurredAt: firebase.firestore.FieldValue, quantity: number, redeemedBy: string): IGameDayHistoryEntry => {
    return {
      id: "",
      occurredAt,
      quantity,
      redeemedBy
    }
  }
}