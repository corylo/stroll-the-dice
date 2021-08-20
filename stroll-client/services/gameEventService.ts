import firebase from "firebase/app";

import { db } from "../config/firebase";

import { gameEventConverter, IGameEvent } from "../../stroll-models/gameEvent/gameEvent";
import { IGetGameEventsResponse } from "../../stroll-models/getGameEventsResponse";

import { GameEventCategory } from "../../stroll-enums/gameEventCategory";
import { GameEventReferenceID } from "../../stroll-enums/gameEventReferenceID";

interface IGameEventService {
  get: (gameID: string, playerID: string, category: GameEventCategory, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGameEventsResponse>;
}

export const GameEventService: IGameEventService = {
  get: async (gameID: string, playerID: string, category: GameEventCategory, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGameEventsResponse> => {
    let query: firebase.firestore.Query = db.collection("games")
      .doc(gameID)
      .collection("events");

    if(category !== GameEventCategory.Unknown) {                
      query = query.where("category", "==", category);
    }

    query = query.where("referenceID", "in", [GameEventReferenceID.General, playerID])
      .orderBy("occurredAt", "desc")   

    if(offset !== null) {
      query = query.startAfter(offset);
    }

    const snap: firebase.firestore.QuerySnapshot = await query      
      .limit(limit)
      .withConverter(gameEventConverter)
      .get();
      
    let results: IGameEvent[] = [];

    snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) =>
      results.push(doc.data()));

    return {
      events: results,
      offset: snap.docs[snap.size - 1]
    };
  }
}