export interface IGamePageStateToggles {
  accept: boolean;
  invite: boolean;
  players: boolean;
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  accept: false,
  invite: false,
  players: false,
  update: false
});