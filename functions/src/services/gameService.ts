import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { GameEventService } from "./gameEventService";
import { GameUpdateService } from "./gameUpdateService";
import { PlayingInBatchService } from "./batch/playingInBatchService";

import { GameEventUtility } from "../utilities/gameEventUtility";
import { GameUtility } from "../utilities/gameUtility";

import { IGame } from "../../../stroll-models/game";

import { FirebaseDocumentID } from "../../../stroll-enums/firebaseDocumentID";
import { GameEventType } from "../../../stroll-enums/gameEventType";

interface IGameService {
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
  onDelete: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;  
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const game: IGame = snapshot.data() as IGame;

    try {
      await GameEventService.create(context.params.id, GameEventUtility.mapGeneralEvent(game.createdAt, GameEventType.Created));
    } catch (err) {
      logger.error(err);
    }
  },
  onDelete: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    try {
      logger.info(`Deleting all references to game [${context.params.id}]`);

      await PlayingInBatchService.deleteAll(context.params.id);
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    if(context.params.id !== FirebaseDocumentID.WarmUp) {
      try {
        if(GameUtility.hasReferenceFieldChanged(before, after)) {
          await GameUpdateService.handleReferenceFieldChange(context.params.id, after);
        }

        if(GameUtility.hasUpdateEventOccurred(before, after)) {      
          await GameUpdateService.handleUpdateEvent(context.params.id, before, after);
        }
        
        if (GameUtility.upcomingToInProgress(before, after)) {
          await GameUpdateService.handleUpcomingToInProgress(context.params.id, after);

          await GameUpdateService.sendGameStartedEmails({ ...after, id: context.params.id });
        } else if (GameUtility.inProgressToCompleted(before, after)) {        
          await GameUpdateService.handleInProgressToCompleted(context.params.id, after);
        } else if (GameUtility.stillInProgress(before, after)) {
          await GameUpdateService.handleStillInProgress(context.params.id, after);
        }
      } catch (err) {
        logger.error(err);
      }
    }
  },
}