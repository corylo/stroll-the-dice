import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IProfileEmailSettings } from "../../stroll-models/profileSettings";

import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileSettingsID } from "../../stroll-enums/profileSettingsID";

interface IProfileSettingsService {
  getByUID: (uid: string, id: ProfileSettingsID) => Promise<IProfileEmailSettings>;
  update: (uid: string, id: ProfileSettingsID, updates: IProfileEmailSettings) => Promise<void>;
}

export const ProfileSettingsService: IProfileSettingsService = {
  getByUID: async (uid: string, id: ProfileSettingsID): Promise<IProfileEmailSettings> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("settings")
      .doc(id)
      .get();

    if(doc.exists) {
      switch(id) {
        case ProfileSettingsID.Email:
          return doc.data() as IProfileEmailSettings;       
        default:
          throw new Error(`Unknown Profile Settings ID: ${id}`);
      }
    }

    throw new Error(ErrorUtility.doesNotExist(DocumentType.ProfileSettings));
  },
  update: async (uid: string, id: ProfileSettingsID, updates: IProfileEmailSettings): Promise<void> => {
    await db.collection("profiles")
      .doc(uid)
      .collection("settings")
      .doc(id)
      .update(updates);
  }
}