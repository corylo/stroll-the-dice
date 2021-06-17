import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { IGame } from "../../../stroll-models/game";
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
      const gameRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)

      const summaryRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("summary")
        .doc(player.ref.game);

      const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("invites")
        .doc(player.ref.invite);

      const playingRef: firebase.firestore.DocumentReference = db.collection("profiles")
        .doc(player.profile.uid)
        .collection("playing")
        .doc(player.ref.game);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot = await transaction.get(gameRef),
          summaryDoc: firebase.firestore.DocumentSnapshot = await transaction.get(summaryRef);

        if(gameDoc.exists && summaryDoc.exists) {
          const game: IGame = gameDoc.data() as IGame,
            summary: IGameSummary = summaryDoc.data() as IGameSummary;

          transaction.update(summaryRef, { players: [...summary.players, player] });

          transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
          
          transaction.set(playingRef, game);
        }
      });
      
      logger.info(`Successfully added player [${player.profile.username}] to game [${player.ref.game}]'s summary.`);
    } catch (err) {
      logger.error(err);
    }
  }
}