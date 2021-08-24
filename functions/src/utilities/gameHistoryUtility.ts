import { IGame } from "../../../stroll-models/game";
import { IGameHistoryEntry } from "../../../stroll-models/gameHistoryEntry";
import { IPlayer } from "../../../stroll-models/player";

interface IGameHistoryUtility {
  mapCreate: (game: IGame, player: IPlayer) => IGameHistoryEntry;
}

export const GameHistoryUtility: IGameHistoryUtility = {  
  mapCreate: (game: IGame, player: IPlayer): IGameHistoryEntry => {
    return {
      endsAt: game.endsAt,
      gameID: game.id,
      id: "",
      place: player.place,
      points: player.points.total,
      steps: player.steps
    }
  }
}