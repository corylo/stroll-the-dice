export interface IAppToggles {
  menu: boolean;
  profile: boolean;
  signIn: boolean;
}

export const defaultAppToggles = (): IAppToggles => ({
  menu: false,
  profile: false,
  signIn: false
});