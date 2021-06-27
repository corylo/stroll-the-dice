
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { PlayingInBatchService } from "./batch/playingInBatchService";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { GameUtility } from "../utilities/gameUtility"

import { IGame } from "../../../stroll-models/game";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

interface IGameService {
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    if(GameUtility.hasReferenceFieldChanged(before, after)) {
      logger.info(`Updating all references to game [${after.id}]`);
      
      try {
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        await PlayingInBatchService.update(batch, context.params.id, after);

        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} documents.`);
      } catch (err) {
        logger.error(err);
      }
    } else if (GameUtility.stillInProgress(before, after)) {
      logger.info(`Progress update for game [${context.params.id}]. Updating steps.`);
      // Fetch all players and update step counts

      if(FirestoreDateUtility.on24HourIncrement(after.startsAt)) {
        const day: number = GameDurationUtility.getDay(after);

        logger.info(`Day [${day}] complete for game [${context.params.id}]. Closing out matchups and paying out to correct predictions.`);
        
        // -- Fetch all matchups and matchup predictions
        // -- Set winner based on step counts, send funds to players with correct predictions
      }
    } else if (GameUtility.upcomingToInProgress(before, after)) {
      logger.info(`Game [${context.params.id}] is now in progress. Generating matchups for days 2 - ${after.duration}`);
      // Generate remaining matchups for days 2 thru last day
    } else if (GameUtility.inProgressToCompleted(before, after)) {
      logger.info(`Game [${context.params.id}] is now complete.`);
      // Do game completion stuff
    } 
  },
}