import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { defaultProfileEmailSettings, IProfileEmailSettings } from "../../../stroll-models/profileSettings";

import { ProfileEmailSettingID } from "../../../stroll-enums/profileEmailSettingID";
import { ProfileSettingsID } from "../../../stroll-enums/profileSettingsID";

interface IProfileSettingsService {
  filterUIDsByEmailSettings: (uids: string[], id: ProfileEmailSettingID) => Promise<string[]>;
  getAllSettingsByUID: (uids: string[], id: ProfileSettingsID) => Promise<IProfileEmailSettings[]>;
  getByUID: (uid: string, id: ProfileSettingsID) => Promise<IProfileEmailSettings>;
}

export const ProfileSettingsService: IProfileSettingsService = {
  filterUIDsByEmailSettings: async (uids: string[], id: ProfileEmailSettingID): Promise<string[]> => {
    const allSettings: IProfileEmailSettings[] = await ProfileSettingsService.getAllSettingsByUID(uids, ProfileSettingsID.Email);

    let filteredUIDs: string[] = [];

    allSettings.forEach((settings: IProfileEmailSettings, index: number) => {
      if(
        id === ProfileEmailSettingID.OnGameStarted && settings.onGameStarted ||
        id === ProfileEmailSettingID.OnGameDayCompleted && settings.onGameDayCompleted
      ) {
        filteredUIDs.push(uids[index]);
      }
    });

    return filteredUIDs;
  },
  getAllSettingsByUID: async (uids: string[], id: ProfileSettingsID): Promise<IProfileEmailSettings[]> => {
    const requests: any[] = uids.map((uid: string) => ProfileSettingsService.getByUID(uid, id));
      
    return await Promise.all(requests);
  },
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
    
    if(id === ProfileSettingsID.Email) {
      return defaultProfileEmailSettings();
    }
    
    return null;
  }
}