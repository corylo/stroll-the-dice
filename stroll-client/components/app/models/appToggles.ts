import { HowToPlayID } from "../../../enums/howToPlayID";

export interface IAppToggles {  
  acceptInvite: boolean;
  deleteAccount: boolean;  
  hideFooter: boolean;
  howToPlay: boolean;
  howToPlayID: HowToPlayID;
  menu: boolean;
  profile: boolean;
  signIn: boolean;
}

export const defaultAppToggles = (): IAppToggles => ({
  acceptInvite: false,
  deleteAccount: false,
  hideFooter: false,
  howToPlay: false,
  howToPlayID: HowToPlayID.Unknown,
  menu: false,
  profile: false,
  signIn: false
});