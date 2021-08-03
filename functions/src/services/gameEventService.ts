import { db } from "../../config/firebase";

import { gameEventConverter, IGameEvent } from "../../../stroll-models/gameEvent/gameEvent";

interface IGameEventService {
  create: (gameID: string, event: IGameEvent) => Promise<void>;
}

export const GameEventService: IGameEventService = {
  create: async (gameID: string, event: IGameEvent): Promise<void> => {
    await db.collection("games")      
      .doc(gameID)
      .collection("events")
      .withConverter(gameEventConverter)
      .add(event);
  }
}