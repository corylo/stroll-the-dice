export interface IGamePageStateToggles {
  invite: boolean;
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  invite: false,
  update: false
});