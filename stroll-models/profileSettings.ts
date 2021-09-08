export interface IProfileEmailSettings {
  onGameDayCompleted: boolean;
  onGameStarted: boolean;
}

export const defaultProfileEmailSettings = (): IProfileEmailSettings => ({
  onGameDayCompleted: true,
  onGameStarted: true
});

export interface IProfileSettings {
  email: IProfileEmailSettings;
}

export const defaultProfileSettings = (): IProfileSettings => ({
  email: defaultProfileEmailSettings()
});