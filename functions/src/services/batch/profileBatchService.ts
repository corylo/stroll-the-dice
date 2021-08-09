import firebase from "firebase-admin";
import { auth, logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { ProfileService } from "../profileService";

import { deletedProfile, IProfile } from "../../../../stroll-models/profile";

interface IProfileBatchService {
  deleteProfile: (user: auth.UserRecord) => Promise<void>;  
  deleteProfilePayments: (uid: string) => Promise<void>;
  deleteProfileStats: (uid: string) => Promise<void>;
}

export const ProfileBatchService: IProfileBatchService = {
  deleteProfile: async (user: auth.UserRecord): Promise<void> => {
    // await ProfileBatchService.deleteProfileStats(user.uid);

    // await ProfileBatchService.deleteProfilePayments(user.uid);

    logger.info(`Deleting profile for user: [${user.uid}]`);

    const profile: IProfile = await ProfileService.get.by.uid(user.uid);
    
    await db.collection("profiles")
      .doc(user.uid)
      .update({
        ...deletedProfile(profile.createdAt, user.uid, profile.updatedAt),
        deletedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  },
  deleteProfilePayments: async (uid: string): Promise<void> => {
    const paymentRefs: firebase.firestore.DocumentReference[] = await db
      .collection("profiles")
      .doc(uid)
      .collection("payments")
      .listDocuments();

    let loopIndex: number = 1;

    const { length } = paymentRefs;
      
    if(length > 0) {
      for(let i: number = 0; i < length; i += 500) {
        const min: number = i,
          max: number = i + 500,
          adjustedMax: number = Math.min(max, length);

        logger.info(`Loop [${loopIndex++}]: Deleting payments [${min + 1} - ${adjustedMax}] for user [${uid}]`);

        const refs: firebase.firestore.DocumentReference[] = paymentRefs.slice(min, max);
        
        const batch: firebase.firestore.WriteBatch = db.batch();

        refs.forEach((ref: firebase.firestore.DocumentReference) => batch.delete(ref));

        await batch.commit();
      }
    }
  },
  deleteProfileStats: async (uid: string): Promise<void> => {
    logger.info(`Deleting stats for user: [${uid}]`);
    
    const batch: firebase.firestore.WriteBatch = db.batch();

    const statRefs: firebase.firestore.DocumentReference[] = await db
      .collection("profiles")
      .doc(uid)
      .collection("stats")
      .listDocuments();

    statRefs.forEach((ref: firebase.firestore.DocumentReference) => batch.delete(ref));

    await batch.commit();
  }
}