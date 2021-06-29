import { logger } from "firebase-functions";

import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { NumberUtility } from "../../../stroll-utilities/numberUtility";

interface IStepService {
  getUpdate: (playerID: string, steps: number) => Promise<IMatchupSideStepUpdate>;
  getUpdates: (matchups: IMatchup[]) => Promise<IMatchupSideStepUpdate[]>;
}

export const StepService: IStepService = {
  getUpdate: async (playerID: string, steps: number): Promise<IMatchupSideStepUpdate> => {
    try {
      steps = steps + NumberUtility.random(0, 2000);
    } catch (err) {
      logger.error(err);
    }

    return {
      id: playerID,
      steps
    }
  },
  getUpdates: async (matchups: IMatchup[]): Promise<IMatchupSideStepUpdate[]> => {
    let updates: IMatchupSideStepUpdate[] = [];

    for(let matchup of matchups) {
      const leftUpdate: IMatchupSideStepUpdate = await StepService.getUpdate(matchup.left.ref, matchup.left.steps),
        rightUpdate: IMatchupSideStepUpdate = await StepService.getUpdate(matchup.right.ref, matchup.right.steps);

      updates = [...updates, leftUpdate, rightUpdate];
    }

    return updates;
  }
}