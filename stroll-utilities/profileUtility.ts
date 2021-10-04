import firebase from "firebase/app";

import { Nano } from "./nanoUtility";

import { defaultStepTrackerProfileReference } from "../stroll-models/stepTrackerProfileReference";
import { IProfile } from "../stroll-models/profile"
import { IProfileReference } from "../stroll-models/profileReference"

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

interface IProfileUtility {
  mapCreate: (uid: string) => IProfile;
  mapReference: (profile: IProfile) => IProfileReference;
}

export const ProfileUtility: IProfileUtility = {  
  mapCreate: (uid: string): IProfile => {
    const friendID: string = Nano.generate(6);

    return {
      color: Color.White,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      deletedAt: null,
      experience: 0,
      friendID,
      icon: Icon.User,
      name: "New Player",
      tracker: defaultStepTrackerProfileReference(),
      uid,
      updatedAt: null,
      username: `Player ${friendID}`
    }
  },
  mapReference: (profile: IProfile): IProfileReference => {
    return {
      color: profile.color,
      deletedAt: profile.deletedAt,
      experience: profile.experience,
      friendID: profile.friendID,
      icon: profile.icon,
      name: profile.name,
      uid: profile.uid,
      username: profile.username
    }
  }
}