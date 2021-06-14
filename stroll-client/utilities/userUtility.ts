import firebase from "firebase/app";

import { DateUtility } from "./dateUtility";

import { defaultProfile, IProfile } from "../../stroll-models/profile";
import { IUser } from "../models/user";

interface IUserUtility {
  mapProfile: (firebaseUser: firebase.User) => IProfile;
  mapUser: (firebaseUser: firebase.User) => IUser;
}

export const UserUtility: IUserUtility = {
  mapProfile: (firebaseUser: firebase.User): IProfile => {
    return {
      ...defaultProfile(),
      createdAt: DateUtility.stringToFirestoreTimestamp(firebaseUser.metadata.creationTime),      
      uid: firebaseUser.uid
    }
  },
  mapUser: (firebaseUser: firebase.User): IUser => {
    return {            
      email: firebaseUser.email || "",      
      name: firebaseUser.displayName,
      profile: UserUtility.mapProfile(firebaseUser)
    }
  }
}