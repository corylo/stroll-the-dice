import firebase from "firebase/app";

import { db } from "../firebase";

import { gameConverter, IGame } from "../../stroll-models/game";
import { IGameUpdate } from "../../stroll-models/gameUpdate";

interface IGameService {
  create: (game: IGame) => Promise<void>;
  delete: (id: string) => Promise<void>;
  fetchGame: (id: string) => Promise<IGame>;
  fetchGames: (uid: string, limit?: number) => Promise<IGame[]>;
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
  fetchGame: async (id: string): Promise<IGame> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("games")
      .doc(id)
      .withConverter(gameConverter)
      .get();

    return doc.exists 
      ? doc.data() as IGame
      : null;
  },
  fetchGames: async (uid: string, limit?: number): Promise<IGame[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .where("creator.uid", "==", uid)
      .orderBy("createdAt", "desc")      
      .limit(limit || 10)
      .withConverter(gameConverter)
      .get();

    let games: IGame[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => 
      games.push(doc.data()));

    return games;
  },
  update: async (id: string, update: IGameUpdate): Promise<void> => {
    return await db.collection("games")
      .doc(id)
      .update(update);
  },
}