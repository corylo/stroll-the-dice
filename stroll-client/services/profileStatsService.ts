import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IProfileGameDayStats } from "../../stroll-models/profileStats";

import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsService {
  getByUID: (uid: string, id: ProfileStatsID) => Promise<IProfileGameDayStats>;
}

export const ProfileStatsService: IProfileStatsService = {
  getByUID: async (uid: string, id: ProfileStatsID): Promise<IProfileGameDayStats> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("stats")
      .doc(id)
      .get();

    if(doc.exists) {
      switch(id) {
        case ProfileStatsID.GameDays:
          return doc.data() as IProfileGameDayStats;
        default:
          throw new Error(`Unknown Profile Stats ID: ${id}`);
      }
    }

    throw new Error(ErrorUtility.doesNotExist(DocumentType.ProfileStats));
  }
}