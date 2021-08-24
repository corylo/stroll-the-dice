import { IProfileGameDayStats, IProfileGamesStats, IProfileNotificationStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: ProfileStatsID) => IProfileGameDayStats | IProfileGamesStats | IProfileNotificationStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: ProfileStatsID): IProfileGameDayStats | IProfileGamesStats | IProfileNotificationStats => {
    switch(id) {
      case ProfileStatsID.GameDays:
        return {
          available: 3,
          redeemed: 0,
          total: 3
        }
      case ProfileStatsID.Games:
        return {
          daysPlayed: 0,
          gamesPlayed: 0,
          lastCreated: "",
          lastJoined: "",
          points: 0,
          steps: 0,
          wins: 0
        }
      case ProfileStatsID.Notifications:
        return {
          lastViewed: "",
          total: 0,
          unviewed: 0,
          viewed: 0
        }
      default:
        throw new Error(`Unknown Profile Stats ID: ${id}`);
    }
  }
}