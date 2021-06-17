import firebase from "firebase/app";

import { db } from "../firebase";

import { IGame } from "../../stroll-models/game";
import { IPlayer, playerConverter } from "../../stroll-models/player";

interface IPlayerService {
  create: (game: IGame, player: IPlayer) => Promise<void>;
  getByGame: (id: string) => Promise<IPlayer[]>;
}

export const PlayerService: IPlayerService = {
  create: async (game: IGame, player: IPlayer): Promise<void> => {
    return await db.collection("games")      
      .doc(game.id)
      .collection("players")
      .doc(player.profile.uid)
      .withConverter(playerConverter)
      .set(player);
  },
  getByGame: async (id: string): Promise<IPlayer[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .doc(id)
      .collection("players")
      .orderBy("profile.username")
      .withConverter(playerConverter)
      .get();

    let players: IPlayer[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => 
      players.push(doc.data()));

    return players;
  }
}