import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { ProfileSettingsUtility } from "../../../utilities/profileSettingsUtility";
import { ProfileStatsUtility } from "../../../utilities/profileStatsUtility";

import { IFriendIDReference, friendIDReferenceConverter } from "../../../../stroll-models/friendIDReference";
import { IProfile, profileConverter } from "../../../../stroll-models/profile";

import { ProfileSettingsID } from "../../../../stroll-enums/profileSettingsID";
import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IUpdateProfileService {
  createProfile: (profile: IProfile) => Promise<void>;
}

export const UpdateProfileService: IUpdateProfileService = {
  createProfile: async (profile: IProfile): Promise<void> => {
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
    
    const friendIDRef: firebase.firestore.DocumentReference = db.collection("friend_ids")
      .doc(profile.friendID)
      .withConverter<IFriendIDReference>(friendIDReferenceConverter);

    batch.set(friendIDRef, { uid: profile.uid });

    return await batch.commit();
  }
}