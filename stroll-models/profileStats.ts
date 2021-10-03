export interface IProfileGamesStats {
  daysPlayed: number;
  gamesPlayed: number;
  lastCreated: string;
  lastJoined: string;
  points: number;
  steps: number;
  wins: number;
}

export interface IProfileGamesStatsUpdate {
  daysPlayed?: number;
  gamesPlayed?: number;
  lastCreated?: string;
  lastJoined?: string;  
  points?: number;
  steps?: number;
  wins?: number;
}

export const defaultProfileGamesStats = (): IProfileGamesStats => ({
  daysPlayed: 0,
  gamesPlayed: 0,
  lastCreated: "",
  lastJoined: "",
  points: 0,
  steps: 0,
  wins: 0
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
  games: IProfileGamesStats;
  notifications: IProfileNotificationStats;
}

export const defaultProfileStats = (): IProfileStats => ({
  games: defaultProfileGamesStats(),
  notifications: defaultProfileNotificationStats()
});