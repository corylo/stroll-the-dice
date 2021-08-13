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

export interface IProfileNotificationStats {  
  lastViewed: string;
  total: number;
  unviewed: number;  
  viewed: number;
}

export const defaultProfileNotificationStats = (): IProfileNotificationStats => ({
  lastViewed: "",
  total: 0,
  unviewed: 0,  
  viewed: 0,
});

export interface IProfileStats {
  gameDays: IProfileGameDayStats;
  games: IProfileGamesStats;
  notifications: IProfileNotificationStats;
}

export const defaultProfileStats = (): IProfileStats => ({
  gameDays: defaultProfileGameDayStats(),
  games: defaultProfileGamesStats(),
  notifications: defaultProfileNotificationStats()
});