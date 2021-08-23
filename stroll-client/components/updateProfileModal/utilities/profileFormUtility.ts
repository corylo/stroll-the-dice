import firebase from "firebase/app";

import { Nano } from "../../../../stroll-utilities/nanoUtility";

import { IProfile } from "../../../../stroll-models/profile";
import { defaultProfileFormState, IProfileFormState } from "../models/profileFormState";
import { IProfileFormStateFields } from "../models/profileFormStateFields";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";
import { defaultStepTrackerProfileReference } from "../../../../stroll-models/stepTrackerProfileReference";
import { IUser } from "../../../models/user";

interface IProfileFormUtility {
  hasChanged: (profile: IProfile, fields: IProfileFormStateFields) => boolean;
  mapCreate: (fields: IProfileFormStateFields, user: IUser) => IProfile;
  mapInitialState: (profile?: IProfile) => IProfileFormState;
  mapUpdate: (fields: IProfileFormStateFields) => IProfileUpdate;
}

export const ProfileFormUtility: IProfileFormUtility = {  
  hasChanged: (profile: IProfile, fields: IProfileFormStateFields): boolean => {
    if(profile) {
      return (
        profile.color !== fields.color ||
        profile.icon !== fields.icon || 
        profile.name !== fields.name || 
        profile.username !== fields.username
      )
    }

    return true;
  },
  mapCreate: (fields: IProfileFormStateFields, user: IUser): IProfile => {
    return {
      color: fields.color,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      deletedAt: null,
      friendID: Nano.generate(6),
      icon: fields.icon,
      name: fields.name,
      tracker: defaultStepTrackerProfileReference(),
      uid: user.profile.uid,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      username: fields.username
    }
  },
  mapInitialState: (profile?: IProfile): IProfileFormState => {
    const state: IProfileFormState = defaultProfileFormState();
    
    if(profile) {
      state.fields.color = profile.color;
      state.fields.icon = profile.icon;
      state.fields.name = profile.name || "";
      state.fields.username = profile.username;
    }

    return state;
  },
  mapUpdate: (fields: IProfileFormStateFields): IProfileUpdate => {
    return {
      color: fields.color,
      icon: fields.icon,
      name: fields.name,
      username: fields.username
    }
  }
}