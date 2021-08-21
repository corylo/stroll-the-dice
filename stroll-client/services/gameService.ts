import firebase from "firebase/app";

import { db } from "../config/firebase";

import { GameDurationUtility } from "../../stroll-utilities/gameDurationUtility";

import { gameConverter, IGame } from "../../stroll-models/game";
import { IGetGamesResponse } from "../../stroll-models/getGamesResponse";
import { IGameUpdate } from "../../stroll-models/gameUpdate";

import { GameStatus } from "../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../stroll-enums/groupGameBy";

interface IGameService {
  create: (game: IGame) => Promise<void>;
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<IGame>;
  getAllByList: (list: string[]) => Promise<IGetGamesResponse>;
  getGrouped: (uid: string, status: GameStatus, groupBy: GroupGameBy, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGamesResponse>;
  getHosting: (uid: string, status: GameStatus, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGamesResponse>;
  getPlayingIn: (uid: string, status: GameStatus, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetGamesResponse>;
  update: (id: string, update: IGameUpdate) => Promise<void>;  
}

export const GameService: IGameService = {
  create: async (game: IGame): Promise<void> => {
    return await db.collection("games")
      .doc(game.id)
      .withConverter(gameConverter)
      .set(game);
  },
  delete: async (id: string): Promise<void> => {
    return await db.collection("games")
      .doc(id)
      .delete();
  },
  get: async (id: string): Promise<IGame> => {
    const doc: firebase.firestore.DocumentSnapshot<IGame> = await db.collection("games")
      .doc(id)
      .withConverter<IGame>(gameConverter)
      .get();

    return doc.exists ? doc.data() : null;
  },
  getAllByList: async (list: string[]): Promise<IGetGamesResponse> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")  
      .where(firebase.firestore.FieldPath.documentId(), "in", list)          
      .withConverter(gameConverter)
      .get();

    let results: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      results.push(doc.data()));
      
    const games: IGame[] = list.map((id: string) => results.find((game: IGame) => game.id === id)),
      offset: firebase.firestore.QueryDocumentSnapshot = snap.size > 0 ? snap.docs[snap.size - 1] : null;

    return {
      games,
      offset
    }
  },
  getGrouped: async (uid: string, status: GameStatus, groupBy: GroupGameBy, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGamesResponse> => {
    if(groupBy === GroupGameBy.Hosting) {
      return await GameService.getHosting(uid, status, limit, offset);
    } else if (groupBy === GroupGameBy.Joined) {
      return await GameService.getPlayingIn(uid, status, limit, offset);
    }
  },
  getHosting: async (uid: string, status: GameStatus, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGamesResponse> => {    
    let query: firebase.firestore.Query = db.collection("games")
      .where("creator.uid", "==", uid)
      .where("status", "==", status)
      .orderBy(GameDurationUtility.getOrderBy(status), GameDurationUtility.getOrderByDirection(status))      
      .orderBy("sortable.name")

    if(offset !== null) {
      query = query.startAfter(offset);
    }
    
    const snap: firebase.firestore.QuerySnapshot = await query    
      .limit(limit)
      .withConverter<IGame>(gameConverter)
      .get();

    let games: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      games.push(doc.data()));
      
    const newOffset: firebase.firestore.QueryDocumentSnapshot = snap.size > 0 
      ? snap.docs[snap.size - 1] 
      : null;

    return {
      games,
      offset: newOffset
    }
  },
  getPlayingIn: async (uid: string, status: GameStatus, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetGamesResponse> => {    
    let query: firebase.firestore.Query = db.collection("profiles")    
      .doc(uid)
      .collection("playing_in")
      .where("status", "==", status)      
      .orderBy(GameDurationUtility.getOrderBy(status), GameDurationUtility.getOrderByDirection(status))
      .orderBy("name")
      
    if(offset !== null) {
      query = query.startAfter(offset);
    }
  
    const snap: firebase.firestore.QuerySnapshot = await query   
      .limit(limit)
      .get();

    let ids: string[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => 
      ids.push(doc.id));

    if(ids.length > 0) {
      return await GameService.getAllByList(ids);
    }

    return {
      games: [],
      offset: null
    }
  },
  update: async (id: string, update: IGameUpdate): Promise<void> => {
    return await db.collection("games")
      .doc(id)
      .update(update);
  }
}