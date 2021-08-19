import { IPlayer } from "../../../stroll-models/player";

interface IPointsUtility {
  mapPointsForSteps: (player: IPlayer, update: number) => IPlayer;
}

export const PointsUtility: IPointsUtility = {
  mapPointsForSteps: (player: IPlayer, update: number): IPlayer => {
    player.points = {
      available: player.points.available + update,
      total: player.points.total + update
    }

    return player;
  }
}