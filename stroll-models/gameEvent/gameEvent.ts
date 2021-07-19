import firebase from "firebase/app";

import { GameEventUtility } from "../../stroll-utilities/gameEventUtility";

import { GameEventCategory } from "../../stroll-enums/gameEventCategory";
import { GameEventType } from "../../stroll-enums/gameEventType";

export interface IGameEvent {  
  category: GameEventCategory;
  id: string;
  occurredAt: firebase.firestore.FieldValue;
  referenceID: string;
  type: GameEventType;
}

export const defaultGameEvent = (): IGameEvent => ({    
  category: GameEventCategory.Game,
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