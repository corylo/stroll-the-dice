export interface IAppToggles {  
  acceptInvite: boolean;
  deleteAccount: boolean;
  menu: boolean;
  profile: boolean;
  signIn: boolean;
}

export const defaultAppToggles = (): IAppToggles => ({
  acceptInvite: false,
  deleteAccount: false,
  menu: false,
  profile: false,
  signIn: false
});