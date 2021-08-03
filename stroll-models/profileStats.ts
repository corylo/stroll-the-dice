export interface IProfileGameDayStats {
  available: number;  
  redeemed: number;
  total: number;
}

export const defaultProfileGameDayStats = (): IProfileGameDayStats => ({
  available: 0,  
  redeemed: 0,
  total: 0
});

export interface IProfileGamesStats {
  lastCreated: string;
  lastJoined: string;
}

export const defaultProfileGamesStats = (): IProfileGamesStats => ({
  lastCreated: "",
  lastJoined: ""
});

export interface IProfileStats {
  gameDays: IProfileGameDayStats;
  games: IProfileGamesStats;
}

export const defaultProfileStats = (): IProfileStats => ({
  gameDays: defaultProfileGameDayStats(),
  games: defaultProfileGamesStats()
});