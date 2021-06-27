import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { PlayerTransactionService } from "./transaction/playerTransactionService";

import { IGame } from "../../../stroll-models/game";
import { matchupConverter } from "../../../stroll-models/matchup";
import { IPlayer } from "../../../stroll-models/player";

interface IPlayerService {
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
}

export const PlayerService: IPlayerService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const player: IPlayer = { ...snapshot.data() as IPlayer, id: snapshot.id };

    try {
      const gameRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game);

      const existingMatchupRef: firebase.firestore.Query = db.collection("games")
        .doc(player.ref.game)
        .collection("matchups")
        .orderBy("createdAt", "desc")
        .limit(1)
        .withConverter(matchupConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot = await transaction.get(gameRef),
          matchupSnap: firebase.firestore.QuerySnapshot = await transaction.get(existingMatchupRef);

        if(gameDoc.exists) {
          const game: IGame = { ...gameDoc.data() as IGame, id: gameDoc.id }; 

          PlayerTransactionService.updateCounts(transaction, gameRef, game, player);
        
          PlayerTransactionService.createPlayingIn(transaction, game, player);

          PlayerTransactionService.handleMatchup(transaction, matchupSnap, game, player);
        }
      });
      
      logger.info(`Successfully completed onCreate function for player [${player.id}] in game [${player.ref.game}].`);
    } catch (err) {
      logger.error(err);
    }
  }
}