import { logger } from "firebase-functions";

import { StepTrackerService } from "./stepTrackerService";

import { NumberUtility } from "../../../stroll-utilities/numberUtility";

import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IStepTracker } from "../../../stroll-models/stepTracker";

interface IStepService {
  getUpdate: (playerID: string, steps: number) => Promise<IMatchupSideStepUpdate>;
  getUpdates: (matchups: IMatchup[]) => Promise<IMatchupSideStepUpdate[]>;
}

export const StepService: IStepService = {
  getUpdate: async (playerID: string, steps: number): Promise<IMatchupSideStepUpdate> => {
    if(playerID !== "") {
      try {
        const tracker: IStepTracker = await StepTrackerService.get(playerID);

        if(tracker) {
          steps = NumberUtility.random(0, 2000);
        }
      } catch (err) {
        logger.error(err);
      }

      return {
        id: playerID,
        steps
      }
    }
  },
  getUpdates: async (matchups: IMatchup[]): Promise<IMatchupSideStepUpdate[]> => {
    let updates: IMatchupSideStepUpdate[] = [];

    for(let matchup of matchups) {
      const leftUpdate: IMatchupSideStepUpdate = await StepService.getUpdate(matchup.left.ref, matchup.left.steps);

      if(leftUpdate) {
        updates = [...updates, leftUpdate];
      }
      
      const rightUpdate: IMatchupSideStepUpdate = await StepService.getUpdate(matchup.right.ref, matchup.right.steps);

      if(rightUpdate) {
        updates = [...updates, rightUpdate];
      }
    }

    return updates;
  }
}