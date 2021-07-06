import firebase from "firebase/app";

import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfile {
  color: Color;
  createdAt?: firebase.firestore.FieldValue; 
  icon: Icon;
  id: string;
  uid: string;
  username: string;
}

export const defaultProfile = (): IProfile => ({
  color: Color.None,
  icon: Icon.None,
  id: "",
  uid: "",
  username: ""
});

export const profileConverter: firebase.firestore.FirestoreDataConverter<IProfile> = {
  toFirestore(profile: IProfile): firebase.firestore.DocumentData {
    return {
      color: profile.color,
      createdAt: profile.createdAt,
      icon: profile.icon,
      id: profile.id,
      username: profile.username
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): IProfile {
    const data: IProfile = snapshot.data(options) as IProfile;

    return {
      color: data.color,
      createdAt: data.createdAt,
      icon: data.icon,
      id: snapshot.id,
      uid: snapshot.id,
      username: data.username  
    }
  }
}