import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IProfileGamesStats } from "../../stroll-models/profileStats";

import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsService {
  getByUID: (uid: string, id: ProfileStatsID) => Promise<IProfileGamesStats>;
}

export const ProfileStatsService: IProfileStatsService = {
  getByUID: async (uid: string, id: ProfileStatsID): Promise<IProfileGamesStats> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("stats")
      .doc(id)
      .get();

    if(doc.exists) {
      switch(id) {     
        case ProfileStatsID.Games:
          return doc.data() as IProfileGamesStats;
        default:
          throw new Error(`Unknown Profile Stats ID: ${id}`);
      }
    }

    throw new Error(ErrorUtility.doesNotExist(DocumentType.ProfileStats));
  }
}