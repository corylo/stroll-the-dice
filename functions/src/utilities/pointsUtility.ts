import { MatchupUtility } from "./matchupUtility";

import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";

interface IPointsUtility {
  updatePointsForSteps: (player: IPlayer, updates: IMatchupSideStepUpdate[]) => IPlayer;
}

export const PointsUtility: IPointsUtility = {
  updatePointsForSteps: (player: IPlayer, updates: IMatchupSideStepUpdate[]): IPlayer => {
    const update: IMatchupSideStepUpdate = MatchupUtility.findStepUpdate(player.id, updates);

    if(update) {
      player.points = {
        available: player.points.available + update.steps,
        total: player.points.total + update.steps
      }
    }

    return player;
  }
}