import firebase from "firebase/app";

import { defaultStepTrackerProfileReference, IStepTrackerProfileReference } from "./stepTrackerProfileReference";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfile {
  color: Color;
  createdAt: firebase.firestore.FieldValue; 
  deletedAt: firebase.firestore.FieldValue; 
  icon: Icon;
  id: string;
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
  icon: Icon.None,
  id: "",
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
  icon: Icon.UserDeleted,
  id: "",
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
      icon: profile.icon,
      id: profile.id,
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
      icon: data.icon,
      id: snapshot.id,
      name: data.name,
      tracker: data.tracker,
      uid: snapshot.id,
      updatedAt: data.updatedAt,
      username: data.username  
    }
  }
}