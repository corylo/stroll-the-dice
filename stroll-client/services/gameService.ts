import firebase from "firebase/app";

import { db } from "../firebase";

import { GameDurationUtility } from "../../stroll-utilities/gameDurationUtility";

import { gameConverter, IGame } from "../../stroll-models/game";
import { IGameUpdate } from "../../stroll-models/gameUpdate";

import { GameStatus } from "../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../stroll-enums/groupGameBy";

interface IGameService {
  create: (game: IGame) => Promise<void>;
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<IGame>;
  getAllByList: (list: string[]) => Promise<IGame[]>;
  getGrouped: (uid: string, status: GameStatus, groupBy: GroupGameBy, limit?: number) => Promise<IGame[]>;
  getHosting: (uid: string, status: GameStatus, limit?: number) => Promise<IGame[]>;
  getPlayingIn: (uid: string, status: GameStatus, limit?: number) => Promise<IGame[]>;
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
  getAllByList: async (list: string[]): Promise<IGame[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")  
      .where(firebase.firestore.FieldPath.documentId(), "in", list)          
      .withConverter(gameConverter)
      .get();

    let games: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      games.push(doc.data()));
      
    return list.map((id: string) => games.find((game: IGame) => game.id === id));
  },
  getGrouped: async (uid: string, status: GameStatus, groupBy: GroupGameBy, limit?: number): Promise<IGame[]> => {
    if(groupBy === GroupGameBy.Hosting) {
      return await GameService.getHosting(uid, status, limit);
    } else if (groupBy === GroupGameBy.Joined) {
      return await GameService.getPlayingIn(uid, status, limit);
    }
  },
  getHosting: async (uid: string, status: GameStatus, limit?: number): Promise<IGame[]> => {    
    const snap: firebase.firestore.QuerySnapshot<IGame> = await db.collection("games")
      .where("creator.uid", "==", uid)
      .where("status", "==", status)
      .orderBy(GameDurationUtility.getOrderBy(status), GameDurationUtility.getOrderByDirection(status))      
      .orderBy("sortable.name")
      .limit(limit || 10)
      .withConverter<IGame>(gameConverter)
      .get();

    let games: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      games.push(doc.data()));
      
    return games;
  },
  getPlayingIn: async (uid: string, status: GameStatus, limit?: number): Promise<IGame[]> => {    
    const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")      
      .doc(uid)
      .collection("playing_in")
      .where("status", "==", status)      
      .orderBy(GameDurationUtility.getOrderBy(status), GameDurationUtility.getOrderByDirection(status))
      .orderBy("name")
      .limit(limit)
      .get();

    let ids: string[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => 
      ids.push(doc.id));

    return ids.length > 0
      ? await GameService.getAllByList(ids)
      : [];
  },
  update: async (id: string, update: IGameUpdate): Promise<void> => {
    return await db.collection("games")
      .doc(id)
      .update(update);
  }
}