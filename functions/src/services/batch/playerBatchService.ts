import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { ProfileUtility } from "../../utilities/profileUtility";

import { IPlayer } from "../../../../stroll-models/player";
import { deletedProfileReference } from "../../../../stroll-models/profileReference";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

import { GameStatus } from "../../../../stroll-enums/gameStatus";

interface IPlayerBatchService {
  deletePlayerFromAllGames: (uid: string) => Promise<void>;
  updateGameStatus: (batch: firebase.firestore.WriteBatch, players: IPlayer[], gameStatus: GameStatus) => void;
  updateProfile: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<void>;
}

export const PlayerBatchService: IPlayerBatchService = {
  deletePlayerFromAllGames: async (uid: string): Promise<void> => {
    const playerSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("players")
      .where("profile.uid", "==", uid)
      .get();

    if(!playerSnap.empty) {
      let loopIndex: number = 1;
  
      const { length } = playerSnap.docs;
        
      for(let i: number = 0; i < length; i += 500) {
        const min: number = i,
          max: number = i + 500,
          adjustedMax: number = Math.min(max, length);

        logger.info(`Loop [${loopIndex++}]: Removing player profile data from games [${min + 1} - ${adjustedMax}] for user [${uid}]`);

        const docs: FirebaseFirestore.QueryDocumentSnapshot[] = playerSnap.docs.slice(min, max);
        
        const batch: firebase.firestore.WriteBatch = db.batch();

        docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => batch.update(doc.ref, {
          ...doc.data(),
          profile: {
            ...deletedProfileReference(uid),            
            deletedAt: firebase.firestore.FieldValue.serverTimestamp()
          }
        }));

        await batch.commit();
      }
    }
  },
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