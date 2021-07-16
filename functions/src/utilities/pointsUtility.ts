import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";

interface IPointsUtility {
  mapPointsForSteps: (player: IPlayer, update: IMatchupSideStepUpdate) => IPlayer;
}

export const PointsUtility: IPointsUtility = {
  mapPointsForSteps: (player: IPlayer, update: IMatchupSideStepUpdate): IPlayer => {
    player.points = {
      available: player.points.available + update.steps,
      total: player.points.total + update.steps
    }

    return player;
  }
}