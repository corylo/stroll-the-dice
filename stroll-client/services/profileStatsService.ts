import firebase from "firebase/app";

import { db } from "../firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IProfileGamePassStats } from "../../stroll-models/profileStats";

import { DocumentType } from "../../stroll-enums/documentType";
import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsService {
  getByUID: (uid: string, id: ProfileStatsID) => Promise<IProfileGamePassStats>;
}

export const ProfileStatsService: IProfileStatsService = {
  getByUID: async (uid: string, id: ProfileStatsID): Promise<IProfileGamePassStats> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("stats")
      .doc(id)
      .get();

    if(doc.exists) {
      switch(id) {
        case ProfileStatsID.GamePass:
          return doc.data() as IProfileGamePassStats;
        default:
          throw new Error(`Unknown Profile Stats ID: ${id}`);
      }
    }

    throw new Error(ErrorUtility.doesNotExist(DocumentType.ProfileStats));
  }
}