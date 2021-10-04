import { IProfile } from "../../../../stroll-models/profile";
import { defaultProfileFormState, IProfileFormState } from "../models/profileFormState";
import { IProfileFormStateFields } from "../models/profileFormStateFields";
import { IProfileUpdate } from "../../../../stroll-models/profileUpdate";

interface IProfileFormUtility {
  hasChanged: (profile: IProfile, fields: IProfileFormStateFields) => boolean;
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