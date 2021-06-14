import { Nano } from "../../../utilities/nanoUtility";

import { IProfile } from "../../../../stroll-models/profile";
import { defaultProfileFormState, IProfileFormState } from "../models/profileFormState";
import { IProfileFormStateFields } from "../models/profileFormStateFields";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";
import { IUser } from "../../../models/user";

interface IProfileFormUtility {
  hasChanged: (profile: IProfile, fields: IProfileFormStateFields) => boolean;
  mapCreate: (fields: IProfileFormStateFields, user: IUser) => IProfile;
  mapInitialState: (profile?: IProfile) => IProfileFormState;
  mapUpdate: (fields: IProfileFormStateFields) => IProfileUpdate;
}

export const ProfileFormUtility: IProfileFormUtility = {  
  hasChanged: (profile: IProfile, fields: IProfileFormStateFields): boolean => {
    return (
      profile.color !== fields.color ||
      profile.icon !== fields.icon || 
      profile.username !== fields.username
    )
  },
  mapCreate: (fields: IProfileFormStateFields, user: IUser): IProfile => {
    return {
      color: fields.color,
      createdAt: user.profile.createdAt,
      icon: fields.icon,
      id: Nano.generate(),
      uid: user.profile.uid,
      username: fields.username
    }
  },
  mapInitialState: (profile?: IProfile): IProfileFormState => {
    const state: IProfileFormState = defaultProfileFormState();
    
    if(profile) {
      state.fields.color = profile.color;
      state.fields.icon = profile.icon;
      state.fields.username = profile.username;
    }

    return state;
  },
  mapUpdate: (fields: IProfileFormStateFields): IProfileUpdate => {
    return {
      color: fields.color,
      icon: fields.icon,
      username: fields.username
    }
  }
}