import firebase from "firebase/app";

import { db } from "../firebase";

import { gameConverter, IGame } from "../../stroll-models/game";
import { IGameUpdate } from "../../stroll-models/gameUpdate";

interface IGameService {
  create: (game: IGame) => Promise<void>;
  delete: (id: string) => Promise<void>;
  get: (id: string) => Promise<IGame>;
  getAllByList: (list: string[]) => Promise<IGame[]>;
  getAllMyGames: (uid: string, limit?: number) => Promise<IGame[]>;
  getAllPlayingIn: (uid: string, limit?: number) => Promise<IGame[]>;
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
      .withConverter(gameConverter)
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
  getAllMyGames: async (uid: string, limit?: number): Promise<IGame[]> => {
    const snap: firebase.firestore.QuerySnapshot<IGame> = await db.collection("games")
      .where("creator.uid", "==", uid)
      .orderBy("startsAt")      
      .orderBy("sortable.name")
      .limit(limit || 10)
      .withConverter(gameConverter)
      .get();

    let games: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      games.push(doc.data()));
      
    return games;
  },
  getAllPlayingIn: async (uid: string, limit?: number): Promise<IGame[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")      
      .doc(uid)
      .collection("playing_in")
      .orderBy("startsAt")
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