import firebase from "firebase/app";

import { db } from "../firebase";

import { IProfile, profileConverter } from "../../stroll-models/profile";
import { IProfileUpdate } from "../../stroll-models/profileUpdate";

import { ProfileErrorCode } from "../enums/profileErrorCode";

interface IProfileServiceGetBy {
  id: (id: string) => Promise<IProfile>;
  uid: (uid: string) => Promise<IProfile>;
}

interface IProfileServiceGet {
  by: IProfileServiceGetBy;
}

interface IProfileService {
  create: (user: IProfile) => Promise<void>;
  get: IProfileServiceGet;
  update: (id: string, update: IProfileUpdate) => Promise<void>;
}

export const ProfileService: IProfileService = {
  create: async (profile: IProfile): Promise<void> => {
    return await db.collection("profiles")
      .doc(profile.uid)
      .withConverter(profileConverter)
      .set(profile);
  },
  get: {
    by: {
      id: async (id: string): Promise<IProfile> => {
        const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
          .where("id", "==", id)
          .withConverter(profileConverter)
          .get();

        let profiles: IProfile[] = [];

        snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IProfile>) =>
          profiles.push(doc.data()));

        if(snap.docs.length === 1) {
          return profiles[0];
        }

        throw new Error(ProfileErrorCode.DoesNotExist);
      },
      uid: async (uid: string): Promise<IProfile> => {
        const doc: firebase.firestore.DocumentData = await db.collection("profiles")
          .doc(uid)
          .withConverter(profileConverter)
          .get();

        if(doc.exists) {
          return doc.data() as IProfile;
        }

        throw new Error(ProfileErrorCode.DoesNotExist);
      }
    }
  },
  update: async (id: string, update: IProfileUpdate): Promise<void> => {
    return await db.collection("profiles")
      .doc(id)
      .update(update);
  },
}