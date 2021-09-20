import firebase from "firebase/app";

import { defaultStepTrackerProfileReference, IStepTrackerProfileReference } from "./stepTrackerProfileReference";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfile {
  color: Color;
  createdAt: firebase.firestore.FieldValue; 
  deletedAt: firebase.firestore.FieldValue; 
  friendID: string;
  experience: number;
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
  experience: 0,
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
  ...defaultProfile(),
  color: Color.White,
  createdAt,
  icon: Icon.UserDeleted,
  name: "Deleted",
  uid,
  updatedAt,
  username: "Deleted"
});

export const placeholderProfile = (): IProfile => ({
  ...defaultProfile(),
  color: Color.White,
  icon: Icon.User,
  username: " ... "
});

export const profileConverter: any = {
  toFirestore(profile: IProfile): firebase.firestore.DocumentData {
    return {
      color: profile.color,
      createdAt: profile.createdAt,
      deletedAt: profile.deletedAt,
      experience: profile.experience,
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
      experience: data.experience,
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