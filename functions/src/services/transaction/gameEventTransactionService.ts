import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";

interface IGameEventTransactionService {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent) => void;  
}

export const GameEventTransactionService: IGameEventTransactionService = {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent): void => {
    const eventRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    transaction.create(eventRef, event);
  }
}