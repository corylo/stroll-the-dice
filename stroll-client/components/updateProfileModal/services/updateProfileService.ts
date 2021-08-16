import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { ProfileStatsUtility } from "../../../utilities/profileStatsUtility";

import { IProfile, profileConverter } from "../../../../stroll-models/profile";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IUpdateProfileService {
  createProfile: (profile: IProfile) => Promise<void>;
}

export const UpdateProfileService: IUpdateProfileService = {
  createProfile: async (profile: IProfile): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    console.log(profile)

    const profileRef: firebase.firestore.DocumentReference<IProfile> = db.collection("profiles")
      .doc(profile.uid)
      .withConverter<IProfile>(profileConverter);

    batch.set(profileRef, profile);

    const gameDaysStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(profile.uid)
      .collection("stats")
      .doc(ProfileStatsID.GameDays);

    batch.set(gameDaysStatsRef, ProfileStatsUtility.mapCreate(ProfileStatsID.GameDays));

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

    return await batch.commit();
  }
}