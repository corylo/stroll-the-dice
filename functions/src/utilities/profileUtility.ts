import { IProfile } from "../../../stroll-models/profile";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IProfileUtility {
  applyUpdate: (profile: IProfile, update: IProfileUpdate) => IProfileUpdate;
  hasChanged: (before: IProfile, after: IProfile) => boolean;
  mapUpdate: (profile: IProfile) => IProfileUpdate;
}

export const ProfileUtility: IProfileUtility = {  
  applyUpdate: (profile: IProfile, update: IProfileUpdate): IProfileUpdate => {
    return {
      ...profile,
      color: update.color,
      icon: update.icon,
      username: update.username
    }
  },
  hasChanged: (before: IProfile, after: IProfile): boolean => {
    return (
      before.color !== after.color || 
      before.icon !== after.icon ||
      before.username !== after.username
    )
  },
  mapUpdate: (profile: IProfile): IProfileUpdate => {
    return {
      color: profile.color,
      icon: profile.icon,
      username: profile.username
    }
  }
}