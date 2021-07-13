import firebase from "firebase-admin";

import { db } from "../../../firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IPlayer } from "../../../../stroll-models/player";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IPlayerBatchService {
  updateGameStatus: (batch: firebase.firestore.WriteBatch, players: IPlayer[], gameStatus: GameStatus) => void;
  updateProfile: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const PlayerBatchService: IPlayerBatchService = {
  updateGameStatus: (batch: firebase.firestore.WriteBatch, players: IPlayer[], gameStatus: GameStatus): void => {
    players.forEach((player: IPlayer) => {      
      const playerRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("players")
        .doc(player.id);

      batch.update(playerRef, { ["ref.gameStatus"]: gameStatus });
    });
  },
  updateProfile: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<void> => {    
    const playerSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("players")
        .where("profile.uid", "==", uid)
        .where("ref.gameStatus", "==", GameStatus.Upcoming)
        .get();

    playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
      const player: IPlayer = doc.data();

      batch.update(doc.ref, { profile: ProfileUtility.applyUpdate(player.profile, update) });
    });
  }
}