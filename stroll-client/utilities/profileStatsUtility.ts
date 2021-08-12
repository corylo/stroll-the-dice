import { IProfileGameDayStats, IProfileGamesStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: ProfileStatsID) => IProfileGameDayStats | IProfileGamesStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: ProfileStatsID): IProfileGameDayStats | IProfileGamesStats => {
    switch(id) {
      case ProfileStatsID.GameDays:
        return {
          available: 3,
          redeemed: 0,
          total: 3
        }
      case ProfileStatsID.Games:
        return {
          lastCreated: "",
          lastJoined: ""
        }
      default:
        throw new Error(`Unknown Profile Stats ID: ${id}`);
    }
  }
}