import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";
import { GameEventUtility } from "../../utilities/gameEventUtility";

import { gameEventConverter, IGameEvent } from "../../../../stroll-models/gameEvent/gameEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";

interface IGameEventTransactionService {
  create: (transaction: firebase.firestore.Transaction, gameID: string, event: IGameEvent) => void;  
  sendPlayerEarnedPointsFromStepsEvent: (transaction: firebase.firestore.Transaction, gameID: string, playerID: string, steps: number) => void;
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
  sendPlayerEarnedPointsFromStepsEvent: (transaction: firebase.firestore.Transaction, gameID: string, playerID: string, steps: number): void => {
    const event: IPlayerEarnedPointsFromStepsEvent = GameEventUtility.mapPlayerEarnedPointsFromStepsEvent(
      playerID, 
      FirestoreDateUtility.beginningOfHour(firebase.firestore.Timestamp.now()), 
      steps
    );

    GameEventTransactionService.create(transaction, gameID, event);
  }
}