import { defaultProfileGamesStats, defaultProfileNotificationStats, IProfileGamesStats, IProfileNotificationStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: ProfileStatsID) => IProfileGamesStats | IProfileNotificationStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: ProfileStatsID): IProfileGamesStats | IProfileNotificationStats => {
    switch(id) {
      case ProfileStatsID.Games:
        return defaultProfileGamesStats();
      case ProfileStatsID.Notifications:
        return defaultProfileNotificationStats();
      default:
        throw new Error(`Unknown Profile Stats ID: ${id}`);
    }
  }
}