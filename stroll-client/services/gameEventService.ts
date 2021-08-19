import firebase from "firebase/app";

import { db } from "../config/firebase";

import { gameEventConverter, IGameEvent } from "../../stroll-models/gameEvent/gameEvent";

import { GameEventCategory } from "../../stroll-enums/gameEventCategory";
import { GameEventReferenceID } from "../../stroll-enums/gameEventReferenceID";

interface IGameEventService {
  get: (gameID: string, playerID: string, category: GameEventCategory, limit: number) => Promise<IGameEvent[]>;
}

export const GameEventService: IGameEventService = {
  get: async (gameID: string, playerID: string, category: GameEventCategory, limit: number): Promise<IGameEvent[]> => {
    let query: firebase.firestore.Query = db.collection("games")
      .doc(gameID)
      .collection("events");

    if(category !== GameEventCategory.Unknown) {                
      query = query.where("category", "==", category);
    }
      
    const snap: firebase.firestore.QuerySnapshot = await query.where("referenceID", "in", [GameEventReferenceID.General, playerID])   
      .orderBy("occurredAt", "desc")        
      .limit(limit)
      .withConverter(gameEventConverter)
      .get();
      
    let results: IGameEvent[] = [];

    snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGameEvent>) =>
      results.push(doc.data()));

    return results;
  }
}