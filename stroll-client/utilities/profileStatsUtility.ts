import { defaultProfileGamesStats, defaultProfileNotificationStats, IProfileGameDayStats, IProfileGamesStats, IProfileNotificationStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: ProfileStatsID) => IProfileGameDayStats | IProfileGamesStats | IProfileNotificationStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: ProfileStatsID): IProfileGameDayStats | IProfileGamesStats | IProfileNotificationStats => {
    switch(id) {
      case ProfileStatsID.GameDays:
        return {
          available: 7,
          redeemed: 0,
          total: 7
        }
      case ProfileStatsID.Games:
        return defaultProfileGamesStats();
      case ProfileStatsID.Notifications:
        return defaultProfileNotificationStats();
      default:
        throw new Error(`Unknown Profile Stats ID: ${id}`);
    }
  }
}