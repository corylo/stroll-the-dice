import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IProfileReference } from "../../../../stroll-models/profileReference";

import { GameEventType } from "../../../../stroll-enums/gameEventType";

interface IGameEventTransactionService {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent) => void;
  updatePlayerProfile: (gameID: string, playerID: string, profile: IProfileReference) => Promise<void>;
}

export const GameEventTransactionService: IGameEventTransactionService = {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent): void => {
    const eventRef: firebase.firestore.DocumentReference = db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .doc();

    transaction.create(eventRef, event);
  },
  updatePlayerProfile: async (gameID: string, playerID: string, profile: IProfileReference): Promise<void> => {    
    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const eventsRef: firebase.firestore.Query = db.collection("games")
        .doc(gameID)
        .collection("events") 
        .where("referenceID", "==", playerID)    
        .where("type", "==", GameEventType.PlayerCreated)
        .withConverter(gameEventConverter);

      const eventSnap: firebase.firestore.QuerySnapshot = await transaction.get(eventsRef);

      if(!eventSnap.empty) {   
        eventSnap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) => 
          transaction.update(doc.ref, { profile }));
      }
    });
  }
}