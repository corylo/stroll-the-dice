import firebase from "firebase/app";

import { db } from "../../../firebase";

import { IProfile, profileConverter } from "../../../../stroll-models/profile";
import { IProfileGamePassStats } from "../../../../stroll-models/profileStats";
import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IUpdateProfileService {
  createProfile: (profile: IProfile, profileStatsID: ProfileStatsID, stats: IProfileGamePassStats) => Promise<void>;
}

export const UpdateProfileService: IUpdateProfileService = {
  createProfile: async (profile: IProfile, profileStatsID: ProfileStatsID, stats: IProfileGamePassStats): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const profileRef: firebase.firestore.DocumentReference<IProfile> = db.collection("profiles")
      .doc(profile.uid)
      .withConverter<IProfile>(profileConverter);

    batch.set(profileRef, profile);

    const profileStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(profile.uid)
      .collection("stats")
      .doc(profileStatsID);

    batch.set(profileStatsRef, stats);

    return await batch.commit();
  }
}