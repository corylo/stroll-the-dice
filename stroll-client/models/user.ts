import { IProfile } from "../../stroll-models/profile";

export interface IUser {
  email: string;
  name: string;
  profile: IProfile;
}