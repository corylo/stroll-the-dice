import { IProfileGamePassStats } from "../../stroll-models/profileStats";

import { ProfileStatsID } from "../../stroll-enums/profileStatsID";

interface IProfileStatsUtility {
  mapCreate: (id: string) => IProfileGamePassStats;
}

export const ProfileStatsUtility: IProfileStatsUtility = {
  mapCreate: (id: string): IProfileGamePassStats => {
    switch(id) {
      case ProfileStatsID.GamePass:
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