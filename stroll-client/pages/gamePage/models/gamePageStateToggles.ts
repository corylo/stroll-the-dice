export interface IGamePageStateToggles {
  accept: boolean;
  invite: boolean;
  players: boolean;
  playing: boolean;
  update: boolean;
}

export const defaultGamePageStateToggles = (): IGamePageStateToggles => ({
  accept: false,
  invite: false,
  players: false,
  playing: false,
  update: false
});