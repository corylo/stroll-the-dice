import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";

interface IGameEventTransactionService {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent) => Promise<void>;
}

export const GameEventTransactionService: IGameEventTransactionService = {
  create: async (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent): Promise<void> => {
    const eventRef: firebase.firestore.DocumentReference = await db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    transaction.create(eventRef, event);
  }
}