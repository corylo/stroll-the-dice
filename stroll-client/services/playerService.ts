import { db } from "../firebase";

import { IGame } from "../../stroll-models/game";
import { IPlayer, playerConverter } from "../../stroll-models/player";

interface IPlayerService {
  create: (game: IGame, player: IPlayer) => Promise<void>;
}

export const PlayerService: IPlayerService = {
  create: async (game: IGame, player: IPlayer): Promise<void> => {
    return await db.collection("games")      
      .doc(game.id)
      .collection("players")
      .doc(player.profile.uid)
      .withConverter(playerConverter)
      .set(player);
  }
}