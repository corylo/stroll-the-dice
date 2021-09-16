import { IProfile } from "../../../stroll-models/profile";
import { IProfileReference } from "../../../stroll-models/profileReference";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

interface IProfileUtility {
  applyUpdate: (profile: IProfileReference, update: IProfileUpdate) => IProfileUpdate;  
  hasChanged: (before: IProfile, after: IProfile) => boolean;
  mapUpdate: (profile: IProfile) => IProfileUpdate;
  validEmail: (value: string) => boolean;
  validFriendID: (value: string) => boolean;
}

export const ProfileUtility: IProfileUtility = {  
  applyUpdate: (profile: IProfileReference, update: IProfileUpdate): IProfileUpdate => {
    return {
      ...profile,
      color: update.color,
      experience: update.experience,
      icon: update.icon,
      name: update.name,
      username: update.username
    }
  },
  hasChanged: (before: IProfile, after: IProfile): boolean => {
    return (
      before.color !== after.color || 
      before.icon !== after.icon ||
      before.name !== after.name ||
      before.username !== after.username
    )
  },
  mapUpdate: (profile: IProfile): IProfileUpdate => {
    return {
      color: profile.color,
      experience: profile.experience,
      icon: profile.icon,
      name: profile.name,
      username: profile.username
    }
  },
  validEmail: (value: string): boolean => {
    if(
      value !== undefined && 
      value !== null && 
      typeof value === "string"
    ) {
      const formatted: string = value.trim();

      if(formatted.length !== 0 && formatted.indexOf("@") > 0) {
        return true;
      }
    }

    return false;  
  },
  validFriendID: (value: string): boolean => {
    if(
      value !== undefined && 
      value !== null && 
      typeof value === "string"
    ) {
      const formatted: string = value.replace(/\W/g, "");

      if(formatted.length === 6) {
        return true;
      }
    }

    return false;
  }
}