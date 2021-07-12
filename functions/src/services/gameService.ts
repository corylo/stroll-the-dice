import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { GameUpdateService } from "./gameUpdateService";
import { PlayingInBatchService } from "./batch/playingInBatchService";

import { GameUtility } from "../utilities/gameUtility";

import { IGame } from "../../../stroll-models/game";

interface IGameService {
  onDelete: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  onDelete: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    try {
      logger.info(`Deleting all references to game [${context.params.id}]`)

      await PlayingInBatchService.deleteAll(context.params.id);
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    try {
      await GameUpdateService.handleReferenceFieldChange(context.params.id, before, after);
      
      if (GameUtility.upcomingToInProgress(before, after)) {
        await GameUpdateService.handleUpcomingToInProgress(context.params.id, after);
      } else if (GameUtility.stillInProgress(before, after)) {
        await GameUpdateService.handleStillInProgress(context.params.id, after);
      } else if (GameUtility.inProgressToCompleted(before, after)) {
        logger.info(`Game [${context.params.id}] is now complete.`);
        
        // Do game completion stuff
      } 
    } catch (err) {
      logger.error(err);
    }
  },
}