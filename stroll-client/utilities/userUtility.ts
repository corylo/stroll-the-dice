import firebase from "firebase/app";

import { defaultProfile, IProfile } from "../../stroll-models/profile";
import { defaultProfileStats } from "../../stroll-models/profileStats";
import { IUser } from "../models/user";

interface IUserUtility {
  mapProfile: (firebaseUser: firebase.User) => IProfile;
  mapUser: (firebaseUser: firebase.User) => IUser;
}

export const UserUtility: IUserUtility = {
  mapProfile: (firebaseUser: firebase.User): IProfile => {
    return {
      ...defaultProfile(),      
      uid: firebaseUser.uid
    }
  },
  mapUser: (firebaseUser: firebase.User): IUser => {
    return {            
      email: firebaseUser.email || "",
      profile: UserUtility.mapProfile(firebaseUser),
      stats: defaultProfileStats()
    }
  }
}