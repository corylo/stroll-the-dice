export interface IProfileGamePassStats {
  available: number;  
  redeemed: number;
  total: number;
}

export const defaultProfileGamePassStats = (): IProfileGamePassStats => ({
  available: 0,  
  redeemed: 0,
  total: 0
});

export interface IProfileStats {
  gamePass: IProfileGamePassStats;
}

export const defaultProfileStats = (): IProfileStats => ({
  gamePass: defaultProfileGamePassStats()
});