import firebase from "firebase/app";
import axios from "axios";

import { db } from "../config/firebase";

import { FriendIDService } from "./friendIDService";

import { ErrorUtility } from "../utilities/errorUtility";

import { IProfile, profileConverter } from "../../stroll-models/profile";
import { IProfileUpdate } from "../../stroll-models/profileUpdate";

import { DocumentType } from "../../stroll-enums/documentType";

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
  update: async (id: string, update: IProfileUpdate): Promise<void> => {
    return await db.collection("profiles")
      .doc(id)
      .update({ 
        ...update, 
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(), 
      });
  },
}