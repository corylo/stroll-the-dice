
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameBatchService } from "./batch/gameBatchService";
import { PlayerBatchService } from "./batch/playerBatchService";

import { ProfileUtility } from "../utilities/profileUtility";

import { IProfile } from "../../../stroll-models/profile";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IProfileService {
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext) => Promise<void>;
}

export const ProfileService: IProfileService = {
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext): Promise<void> => {
    const before: IProfile = change.before.data(),
      after: IProfile = change.after.data();
  
    if(ProfileUtility.hasChanged(before, after)) {
      logger.info(`Updating documents for user: ${after.username}`);
      
      try {
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        const update: IProfileUpdate = ProfileUtility.mapUpdate(after);
  
        await GameBatchService.updateCreator(batch, context.params.id, update);

        await PlayerBatchService.updateProfile(batch, context.params.id, update);

        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} documents.`);
      } catch (err) {
        logger.error(err);
      }
    }
  }
}