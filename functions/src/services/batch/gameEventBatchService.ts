import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";

interface IGameEventBatchService {
  create: (batch: firebase.firestore.WriteBatch, gameID: string, event: IGameEvent) => void;
}

export const GameEventBatchService: IGameEventBatchService = {
  create: (batch: firebase.firestore.WriteBatch, gameID: string, event: IGameEvent): void => {
    const eventRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    batch.create(eventRef, event);
  }
}