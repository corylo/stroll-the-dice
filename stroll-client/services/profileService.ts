import firebase from "firebase/app";
import axios from "axios";

import { db } from "../config/firebase";

import { FriendIDService } from "./friendIDService";

import { ErrorUtility } from "../utilities/errorUtility";
import { ProfileSettingsUtility } from "../utilities/profileSettingsUtility";
import { ProfileStatsUtility } from "../utilities/profileStatsUtility";

import { friendIDReferenceConverter, IFriendIDReference } from "../../stroll-models/friendIDReference";
import { IProfile, profileConverter } from "../../stroll-models/profile";
import { IProfileUpdate } from "../../stroll-models/profileUpdate";

import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileSettingsID } from "../../stroll-enums/profileSettingsID";
import { ProfileStatsID } from "../../stroll-enums/profileStatsID";
import { ProfileUtility } from "../../stroll-utilities/profileUtility";

interface IProfileServiceGetBy {
  friendID: (id: string) => Promise<IProfile>;
  uid: (uid: string) => Promise<IProfile>;
}

interface IProfileServiceGet {
  by: IProfileServiceGetBy;
}

interface IProfileService {
  create: (profile: IProfile) => Promise<void>;
  get: IProfileServiceGet;
  getAllByUID: (uids: string[]) => Promise<IProfile[]>;
  getAllByUIDIndividually: (uids: string[]) => Promise<IProfile[]>;
  getOrCreate: (uid: string) => Promise<IProfile>;
  update: (id: string, update: IProfileUpdate) => Promise<void>;
}

export const ProfileService: IProfileService = {
  create: async (profile: IProfile): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const profileRef: firebase.firestore.DocumentReference<IProfile> = db.collection("profiles")
      .doc(profile.uid)
      .withConverter<IProfile>(profileConverter);

    batch.set(profileRef, profile);

    const emailSettingsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(profile.uid)
      .collection("settings")
      .doc(ProfileSettingsID.Email);

    batch.set(emailSettingsRef, ProfileSettingsUtility.mapCreate(ProfileSettingsID.Email));

    const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(profile.uid)
      .collection("stats")
      .doc(ProfileStatsID.Games);

    batch.set(gamesStatsRef, ProfileStatsUtility.mapCreate(ProfileStatsID.Games));

    const notificationStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(profile.uid)
      .collection("stats")
      .doc(ProfileStatsID.Notifications);

    batch.set(notificationStatsRef, ProfileStatsUtility.mapCreate(ProfileStatsID.Notifications));
    
    const friendIDRef: firebase.firestore.DocumentReference = db.collection("friend_ids")
      .doc(profile.friendID)
      .withConverter<IFriendIDReference>(friendIDReferenceConverter);

    batch.set(friendIDRef, { uid: profile.uid });

    return await batch.commit();
  },
  get: {
    by: {
      friendID: async (id: string): Promise<IProfile> => {
        const uid: string = await FriendIDService.getUIDByFriendID(id);

        return await ProfileService.get.by.uid(uid);
      },
      uid: async (uid: string): Promise<IProfile> => {
        const doc: firebase.firestore.DocumentSnapshot<IProfile> = await db.collection("profiles")
          .doc(uid)
          .withConverter<IProfile>(profileConverter)
          .get();
        
        if(doc.exists) {
          return doc.data();
        }

        throw new Error(ErrorUtility.doesNotExist(DocumentType.Profile));
      }
    }
  },
  getAllByUID: async (uids: string[]): Promise<IProfile[]> => {
    const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
      .where(firebase.firestore.FieldPath.documentId(), "in", uids)
      .withConverter(profileConverter)
      .get();

    let profiles: IProfile[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IProfile>) =>
      profiles.push(doc.data()));

    return profiles;
  },
  getAllByUIDIndividually: async (uids: string[]): Promise<IProfile[]> => {
    const requests: any[] = uids.map((uid: string) => ProfileService.get.by.uid(uid));

    return await axios.all(requests);
  },
  getOrCreate: async (uid: string): Promise<IProfile> => {
    try {
      return await ProfileService.get.by.uid(uid);
    } catch (err) {          
      if(err.message === ErrorUtility.doesNotExist(DocumentType.Profile)) {
        try {
          const profile: IProfile = ProfileUtility.mapCreate(uid);

          await ProfileService.create(profile);

          return profile;
        } catch (err) {          
          console.error(err);
        }
      }

      return null;
    }
  },
  update: async (id: string, update: IProfileUpdate): Promise<void> => {
    return await db.collection("profiles")
      .doc(id)
      .update({ 
        ...update, 
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(), 
      });
  },
}