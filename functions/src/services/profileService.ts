import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { EmailService } from "./emailService";
import { NotificationBatchService } from "./batch/notificationBatchService";
import { UserService } from "./userService";

import { NotificationUtility } from "../utilities/notificationUtility";

import { IProfile, profileConverter } from "../../../stroll-models/profile";

interface IProfileServiceGetBy {
  uid: (uid: string) => Promise<IProfile>;
}

interface IProfileServiceGet {
  by: IProfileServiceGetBy;
}

interface IProfileService {
  get: IProfileServiceGet;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>; 
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
    const profile: IProfile = { ...snapshot.data(), uid: snapshot.id } as IProfile;

    try {
      await NotificationBatchService.create(context.params.id, NotificationUtility.mapCreate([
          "We've started you off with 7 free Game Days on the house!", 
          "For more info on how to play, check out the How To Play page by clicking on this notification.",
          NotificationUtility.getRandomGoodLuckStatement()
        ],
        `Welcome, ${profile.username}!`,
        profile.createdAt,
        "how-to-play"
      ));

      const email: string = await UserService.getEmailByUID(profile.uid);

      await EmailService.sendWelcomeEmail(profile.username, email);
    } catch (err) {
      logger.error(err);
    }
  }
}