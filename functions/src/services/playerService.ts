import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { PlayerTransactionService } from "./transaction/playerTransactionService";

import { gameConverter, IGame } from "../../../stroll-models/game";
import { matchupConverter } from "../../../stroll-models/matchup";
import { IPlayer, playerConverter } from "../../../stroll-models/player";

interface IPlayerService {
  getByGame: (id: string) => Promise<IPlayer[]>;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
}

export const PlayerService: IPlayerService = {
  getByGame: async (id: string): Promise<IPlayer[]> => {    
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .doc(id)
      .collection("players")
      .orderBy("createdAt")
      .withConverter(playerConverter)
      .get();

    let players: IPlayer[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => 
      players.push(doc.data()));
    
    return players;
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const player: IPlayer = { ...snapshot.data() as IPlayer, id: snapshot.id };

    try {
      const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
        .doc(player.ref.game)
        .withConverter<IGame>(gameConverter);

      const existingMatchupRef: firebase.firestore.Query = db.collection("games")
        .doc(player.ref.game)
        .collection("matchups")
        .orderBy("createdAt", "desc")
        .limit(1)
        .withConverter(matchupConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot<IGame> = await transaction.get(gameRef),
          matchupSnap: firebase.firestore.QuerySnapshot = await transaction.get(existingMatchupRef);

        if(gameDoc.exists) {
          const game: IGame = gameDoc.data(); 

          PlayerTransactionService.updateCounts(transaction, gameRef, game, player);
        
          PlayerTransactionService.handleMatchup(transaction, matchupSnap, game, player);
        }
      });
      
      logger.info(`Successfully completed onCreate function for player [${player.id}] in game [${player.ref.game}].`);
    } catch (err) {
      logger.error(err);
    }
  }
}