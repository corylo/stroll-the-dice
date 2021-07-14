
import firebase from "firebase-admin";

import { db } from "../../firebase";

import { DateUtility } from "../../../stroll-utilities/dateUtility";
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameEventUtility } from "../../../stroll-utilities/gameEventUtility";

import { gameEventConverter, IGameEvent } from "../../../stroll-models/gameEvent/gameEvent";

import { GameEventType } from "../../../stroll-enums/gameEventType";

interface IGameEventService {
  create: (gameID: string, event: IGameEvent) => Promise<void>;
  createDayCompletedEvent: (gameID: string, startsAt: firebase.firestore.FieldValue, day: number) => Promise<void>;
}

export const GameEventService: IGameEventService = {
  create: async (gameID: string, event: IGameEvent): Promise<void> => {
    await db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .add(event);
  },
  createDayCompletedEvent: async (gameID: string, startsAt: firebase.firestore.FieldValue, day: number): Promise<void> => {
    const endOfDay: number = DateUtility.daysToMillis(day) / 1000,
        endsAt: firebase.firestore.FieldValue = FirestoreDateUtility.dateToTimestamp(new Date(FirestoreDateUtility.add(startsAt, endOfDay)));
        
    await GameEventService.create(
      gameID, 
      GameEventUtility.mapGeneralEvent(endsAt, GameEventType.DayCompleted)
    );
  }
}