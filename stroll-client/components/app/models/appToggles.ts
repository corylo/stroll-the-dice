export interface IAppToggles {  
  acceptInvite: boolean;
  menu: boolean;
  profile: boolean;
  signIn: boolean;
}

export const defaultAppToggles = (): IAppToggles => ({
  acceptInvite: false,
  menu: false,
  profile: false,
  signIn: false
});