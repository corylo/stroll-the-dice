import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameEventBatchService } from "./batch/gameEventBatchService";
import { GameEventTransactionService } from "./transaction/gameEventTransactionService";
import { PlayerTransactionService } from "./transaction/playerTransactionService";

import { GameEventUtility } from "../utilities/gameEventUtility";
import { PlayerUtility } from "../utilities/playerUtility";

import { gameConverter, IGame } from "../../../stroll-models/game";
import { matchupConverter } from "../../../stroll-models/matchup";
import { IPlayer, playerConverter } from "../../../stroll-models/player";

interface IPlayerService {
  getByGame: (id: string) => Promise<IPlayer[]>;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IPlayer>>, context: EventContext) => Promise<void>;
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
        .withConverter(matchupConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameDoc: firebase.firestore.DocumentSnapshot<IGame> = await transaction.get(gameRef),
          matchupSnap: firebase.firestore.QuerySnapshot = await transaction.get(existingMatchupRef);

        if(gameDoc.exists) {
          const game: IGame = gameDoc.data(); 

          PlayerTransactionService.handleMatchup(transaction, matchupSnap, game, player);

          if(game.creator.uid !== player.profile.uid) {          
            GameEventTransactionService.create(transaction, game.id, GameEventUtility.mapPlayerCreatedEvent(player.createdAt, player.profile));
          }
        }
      });
      
      logger.info(`Successfully completed onCreate function for player [${player.id}] in game [${player.ref.game}].`);
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IPlayer>>, context: EventContext): Promise<void> => {
    const before: IPlayer = change.before.data(),
      after: IPlayer = change.after.data();
  
    try {
      if(PlayerUtility.hasProfileChanged(before, after)) {
        await GameEventTransactionService.updatePlayerProfileInMatchupsAndPlayerCreatedEvents(context.params.gameID, context.params.id, after.profile);

        await GameEventBatchService.updatePlayerProfileInPredictionEvents(context.params.gameID, context.params.id, after.profile);
      }
    } catch (err) {
      logger.error(err);
    }
  }
}