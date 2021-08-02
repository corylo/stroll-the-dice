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

export interface IProfileStats {
  gameDay: IProfileGameDayStats;
}

export const defaultProfileStats = (): IProfileStats => ({
  gameDay: defaultProfileGameDayStats()
});