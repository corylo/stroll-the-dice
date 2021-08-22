import { IPlayer } from "../../../stroll-models/player";
import { IPlayerDayCompletedSummary } from "../../../stroll-models/playerDayCompletedSummary";

interface IPointsUtility {
  mapEndOfDayPoints: (player: IPlayer, summary: IPlayerDayCompletedSummary) => IPlayer;
  mapPointsForSteps: (player: IPlayer, update: number) => IPlayer;
}

export const PointsUtility: IPointsUtility = {
  mapEndOfDayPoints: (player: IPlayer, summary: IPlayerDayCompletedSummary): IPlayer => {
    player.points = {
      available: player.points.available + summary.received,
      total: player.points.total + (summary.gained - summary.lost)
    }

    return player;
  },
  mapPointsForSteps: (player: IPlayer, update: number): IPlayer => {
    player.points = {
      available: player.points.available + update,
      total: player.points.total + update
    }

    return player;
  }
}