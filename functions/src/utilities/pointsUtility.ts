import { IPlayer, IPlayerPoints } from "../../../stroll-models/player";
import { IPlayerDayCompletedSummary } from "../../../stroll-models/playerDayCompletedSummary";

interface IPointsUtility {
  mapEndOfDayPoints: (player: IPlayer, summary: IPlayerDayCompletedSummary) => IPlayerPoints;
  mapPointsForSteps: (player: IPlayer, update: number) => IPlayerPoints;
}

export const PointsUtility: IPointsUtility = {
  mapEndOfDayPoints: (player: IPlayer, summary: IPlayerDayCompletedSummary): IPlayerPoints => {
    return {
      available: player.points.available + summary.received,
      total: player.points.total + (summary.gained - summary.lost)
    };
  },
  mapPointsForSteps: (player: IPlayer, update: number): IPlayerPoints => {
    return {
      available: player.points.available + update,
      total: player.points.total + update
    }
  }
}