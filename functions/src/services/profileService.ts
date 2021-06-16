
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameService } from "./gameService";

import { IProfile } from "../../../stroll-models/profile";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IProfileService {
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext) => Promise<void>;
}

export const ProfileService: IProfileService = {
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext): Promise<void> => {
    const before: IProfile = change.before.data(),
      after: IProfile = change.after.data();
  
    if(
      before.color !== after.color || 
      before.icon !== after.icon ||
      before.username !== after.username
    ) {
      logger.info(`Updating games for user: ${after.username}`);
      
      try {
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        const update: IProfileUpdate = {
          color: after.color,
          icon: after.icon,
          username: after.username
        };
  
        await GameService.batchUpdate(batch, context.params.id, update);
  
        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} documents.`);
      } catch (err) {
        logger.error(err);
      }
    }
  }
}