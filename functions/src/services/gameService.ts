
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { PlayingInService } from "./playingInService";

import { GameUtility } from "../utilities/gameUtility";
import { ProfileUtility } from "../utilities/profileUtility";

import { IGame } from "../../../stroll-models/game";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface IGameServiceBatch {
  update: (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate) => Promise<firebase.firestore.WriteBatch>;
}

interface IGameService {
  batch: IGameServiceBatch;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  batch: {
    update: async (batch: firebase.firestore.WriteBatch, uid: string, update: IProfileUpdate): Promise<firebase.firestore.WriteBatch> => {    
      const gameSnap: firebase.firestore.QuerySnapshot = await db.collection("games")
        .where("creator.uid", "==", uid)
        .get();

      gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
        const game: IGame = doc.data();

        batch.update(doc.ref, { creator: ProfileUtility.applyUpdate(game.creator, update) });
      });

      return batch;
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    if(GameUtility.hasReferenceFieldChanged(before, after)) {
      logger.info(`Updating all references to game [${after.id}]`);
      
      try {
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        await PlayingInService.batch.update(batch, context.params.id, after);

        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} documents.`);
      } catch (err) {
        logger.error(err);
      }
    } else if (GameUtility.stillInProgress(before, after)) {
      // Fetch all players and update step counts

      // If current time is 24hrs from startsAt
      // -- Fetch all matchups and matchup predictions
      // -- Set winner based on step counts, send funds to players with correct predictions
    } else if (GameUtility.upcomingToInProgress(before, after)) {
      // Generate remaining matchups for days 2 thru last day
    } else if (GameUtility.inProgressToCompleted(before, after)) {
      // Do game completion stuff
    } 
  },
}