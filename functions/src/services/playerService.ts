import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { IGameSummary } from "../../../stroll-models/gameSummary";
import { IPlayer } from "../../../stroll-models/player";

interface IPlayerService {
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
}

export const PlayerService: IPlayerService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const player: IPlayer = snapshot.data() as IPlayer;

    player.id = snapshot.id;
    
    try {
      const summaryRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("summary")
        .doc(player.ref.game);

      const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("invites")
        .doc(player.ref.invite);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const doc: firebase.firestore.DocumentSnapshot = await transaction.get(summaryRef);

        if(doc.exists) {
          const summary: IGameSummary = doc.data() as IGameSummary;

          transaction.update(summaryRef, { players: [...summary.players, player] });
        }

        transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
      });
      
      logger.info(`Successfully added player [${player.profile.username}] to game [${player.ref.game}]'s summary.`);
    } catch (err) {
      logger.error(err);
    }
  }
}