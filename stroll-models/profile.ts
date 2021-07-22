import firebase from "firebase/app";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";
import { StepTracker } from "../stroll-enums/stepTracker";

export interface IProfile {
  color: Color;
  createdAt?: firebase.firestore.FieldValue; 
  icon: Icon;
  id: string;
  name: string;
  tracker?: StepTracker;
  uid: string;
  username: string;
}

export const defaultProfile = (): IProfile => ({
  color: Color.None,
  icon: Icon.None,
  id: "",
  name: "",
  tracker: StepTracker.Unknown,
  uid: "",
  username: ""
});

export const profileConverter: any = {
  toFirestore(profile: IProfile): firebase.firestore.DocumentData {
    return {
      color: profile.color,
      createdAt: profile.createdAt,
      icon: profile.icon,
      id: profile.id,
      name: profile.name,
      tracker: profile.tracker,
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
      icon: data.icon,
      id: snapshot.id,
      name: data.name,
      tracker: data.tracker,
      uid: snapshot.id,
      username: data.username  
    }
  }
}