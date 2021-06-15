export interface IGamePageStateToggles {
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  update: false
});