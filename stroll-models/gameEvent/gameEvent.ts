import firebase from "firebase/app";

import { GameEventUtility } from "../../stroll-utilities/gameEventUtility";

import { GameEventType } from "../../stroll-enums/gameEventType";

export interface IGameEvent {  
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  referenceID: string;
  type: GameEventType;
}

export const defaultGameEvent = (): IGameEvent => ({    
  id: "",
  occurredAt: firebase.firestore.FieldValue.serverTimestamp(),
  referenceID: "",
  type: GameEventType.Unknown
});

export const gameEventConverter: any = {
  toFirestore(event: any): firebase.firestore.DocumentData {
    return GameEventUtility.mapToFirestore(event);
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): any {
    return GameEventUtility.mapFromFirestore(snapshot.id, snapshot.data());
  }
}