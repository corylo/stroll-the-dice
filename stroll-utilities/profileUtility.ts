import { IProfile } from "../stroll-models/profile"
import { IProfileReference } from "../stroll-models/profileReference"

interface IProfileUtility {
  mapReference: (profile: IProfile) => IProfileReference;
}

export const ProfileUtility: IProfileUtility = {  
  mapReference: (profile: IProfile): IProfileReference => {
    return {
      color: profile.color,
      deletedAt: profile.deletedAt,
      friendID: profile.friendID,
      icon: profile.icon,
      level: profile.level,
      name: profile.name,
      uid: profile.uid,
      username: profile.username
    }
  }
}