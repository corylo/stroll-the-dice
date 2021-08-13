import { Role } from "../../stroll-enums/role";
import { defaultProfile, IProfile } from "../../stroll-models/profile";
import { defaultProfileStats, IProfileStats } from "../../stroll-models/profileStats";

export interface IUser {
  email: string;
  profile: IProfile;
  roles: Role[];
  stats: IProfileStats;
}

export const defaultUser = (): IUser => ({
  email: "",
  profile: defaultProfile(),
  roles: [],
  stats: defaultProfileStats()
});