import { IProfile } from "../../stroll-models/profile";
import { IProfileStats } from "../../stroll-models/profileStats";

export interface IUser {
  email: string;
  profile: IProfile;
  stats: IProfileStats;
}