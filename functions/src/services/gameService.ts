import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { GameUpdateService } from "./gameUpdateService";

import { GameUtility } from "../utilities/gameUtility";

import { IGame } from "../../../stroll-models/game";

interface IGameService {
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
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