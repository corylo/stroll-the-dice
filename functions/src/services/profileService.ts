
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { GameBatchService } from "./batch/gameBatchService";
import { NotificationService } from "./notificationService";
import { PlayerBatchService } from "./batch/playerBatchService";

import { NotificationUtility } from "../utilities/notificationUtility";
import { ProfileUtility } from "../utilities/profileUtility";

import { IProfile, profileConverter } from "../../../stroll-models/profile";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IProfileServiceGetBy {
  uid: (uid: string) => Promise<IProfile>;
}

interface IProfileServiceGet {
  by: IProfileServiceGetBy;
}

interface IProfileService {
  get: IProfileServiceGet;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>; 
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext) => Promise<void>;
}

export const ProfileService: IProfileService = {
  get: {
    by: {
      uid: async (uid: string): Promise<IProfile> => {
        const doc: firebase.firestore.DocumentSnapshot<IProfile> = await db.collection("profiles")
          .doc(uid)
          .withConverter<IProfile>(profileConverter)
          .get();
        
        if(doc.exists) {
          return doc.data();
        }

        throw new Error(`Profile for user: [${uid}] does not exist.`);
      }
    }
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const profile: IProfile = snapshot.data() as IProfile;

    try {
      await NotificationService.create(context.params.id, NotificationUtility.mapCreate(
        "We're glad you're here! For more info on how to play, check out the How To Play page 😃",
        `Welcome ${profile.username}!`,
        profile.createdAt
      ));
    } catch (err) {
      logger.error(err);
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IProfile>>, context: EventContext): Promise<void> => {
    const before: IProfile = change.before.data(),
      after: IProfile = change.after.data();
  
    if(ProfileUtility.hasChanged(before, after) && after.deletedAt === null) {
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