import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { ProfileUtility } from "../utilities/profileUtility";

import { IGame } from "../../../stroll-models/game";
import { IPlayer } from "../../../stroll-models/player";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IPlayerServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

interface IPlayerService {
  batch: IPlayerServiceBatch;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
}

export const PlayerService: IPlayerService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
      const playerSnap: firebase.firestore.QuerySnapshot = await db.collectionGroup("players")
        .where("profile.uid", "==", uid)
        .get();

      playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => {
        const player: IPlayer = doc.data();

        batch.update(doc.ref, { profile: ProfileUtility.applyUpdate(player.profile, update) });
      });

      return batch;
    }
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const player: IPlayer = snapshot.data() as IPlayer;

    player.id = snapshot.id;
    
    try {
      const gameRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)

      const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("invites")
        .doc(player.ref.invite);

      const playingRef: firebase.firestore.DocumentReference = db.collection("profiles")
        .doc(player.profile.uid)
        .collection("playing_in")
        .doc(player.ref.game);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot = await transaction.get(gameRef);

        if(gameDoc.exists) {
          const game: IGame = gameDoc.data() as IGame;

          if(player.profile.uid !== game.creator.uid) {               
            transaction.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

            transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
          }
        
          transaction.set(playingRef, { createdAt: player.createdAt });
        }
      });
      
      logger.info(`Successfully added game [${player.ref.game}] to [${player.profile.username}]'s games.`);
    } catch (err) {
      logger.error(err);
    }
  }
}