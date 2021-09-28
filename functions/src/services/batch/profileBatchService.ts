import firebase from "firebase-admin";
import { auth, logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { ProfileService } from "../profileService";

import { deletedProfile, IProfile } from "../../../../stroll-models/profile";

interface IProfileBatchService {
  deleteProfile: (user: auth.UserRecord) => Promise<void>;  
  deleteProfileNotifications: (uid: string) => Promise<void>;
}

export const ProfileBatchService: IProfileBatchService = {
  deleteProfile: async (user: auth.UserRecord): Promise<void> => {
    logger.info(`Deleting profile for user: [${user.uid}]`);

    const profile: IProfile = await ProfileService.get.by.uid(user.uid);
    
    await db.collection("profiles")
      .doc(user.uid)
      .update({
        ...deletedProfile(profile.createdAt, user.uid, profile.updatedAt),
        deletedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  },
  deleteProfileNotifications: async (uid: string): Promise<void> => {
    logger.info(`Deleting notifications for user: [${uid}]`);
    
    const batch: firebase.firestore.WriteBatch = db.batch();

    const notificationRefs: firebase.firestore.DocumentReference[] = await db
      .collection("profiles")
      .doc(uid)
      .collection("notifications")
      .listDocuments();

    const { length } = notificationRefs;

    for(let i: number = 0; i < length; i += 500) {
      const min: number = i,
        max: number = i + 500;

      const refs: firebase.firestore.DocumentReference[] = notificationRefs.slice(min, max);
      
      refs.forEach((ref: firebase.firestore.DocumentReference) => batch.delete(ref));

      await batch.commit(); 
    }
  }
}