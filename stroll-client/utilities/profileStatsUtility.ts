import { IProfileGameDayStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: string) => IProfileGameDayStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: string): IProfileGameDayStats => {
    switch(id) {
      case ProfileStatsID.GameDays:
        return {
          available: 0,
          redeemed: 0,
          total: 0
        }
      default:
        throw new Error(`Unknown Profile Stats ID: ${id}`);
    }
  }
}