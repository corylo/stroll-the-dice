import { defaultProfile, IProfile } from "../../stroll-models/profile";
import { defaultProfileStats, IProfileStats } from "../../stroll-models/profileStats";

export interface IUser {
  email: string;
  profile: IProfile;
  stats: IProfileStats;
}

export const defaultUser = (): IUser => ({
  email: "",
  profile: defaultProfile(),
  stats: defaultProfileStats()
});