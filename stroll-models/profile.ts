import firebase from "firebase/app";

import { defaultStepTrackerProfileReference, IStepTrackerProfileReference } from "./stepTrackerProfileReference";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfile {
  color: Color;
  createdAt: firebase.firestore.FieldValue; 
  deletedAt: firebase.firestore.FieldValue; 
  friendID: string;
  icon: Icon;
  name: string;
  tracker: IStepTrackerProfileReference;
  uid: string;
  updatedAt: firebase.firestore.FieldValue;
  username: string;
}

export const defaultProfile = (): IProfile => ({
  color: Color.None,
  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  deletedAt: null,
  friendID: "",
  icon: Icon.None,
  name: "",
  tracker: defaultStepTrackerProfileReference(),
  uid: "",
  updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  username: ""
});

export const deletedProfile = (
  createdAt: firebase.firestore.FieldValue,
  uid: string,
  updatedAt: firebase.firestore.FieldValue
): IProfile => ({
  color: Color.Gray5,
  createdAt,
  deletedAt: null,
  friendID: "",
  icon: Icon.UserDeleted,
  name: "Deleted",
  tracker: defaultStepTrackerProfileReference(),
  uid,
  updatedAt,
  username: "Deleted"
});

export const profileConverter: any = {
  toFirestore(profile: IProfile): firebase.firestore.DocumentData {
    return {
      color: profile.color,
      createdAt: profile.createdAt,
      deletedAt: profile.deletedAt,
      friendID: profile.friendID,      
      icon: profile.icon,
      name: profile.name,
      tracker: profile.tracker,
      updatedAt: profile.updatedAt,
      username: profile.username
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IProfile>
  ): IProfile {
    const data: IProfile = snapshot.data();

    return {
      color: data.color,
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      friendID: data.friendID,
      icon: data.icon,
      name: data.name,
      tracker: data.tracker,
      uid: snapshot.id,
      updatedAt: data.updatedAt,
      username: data.username  
    }
  }
}