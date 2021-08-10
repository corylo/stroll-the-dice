import { db } from "../../config/firebase";

import { gameDayHistoryEntryConverter, IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry";

interface IGameDayHistoryService {
  create: (uid: string, entry: IGameDayHistoryEntry) => Promise<void>;
}

export const GameDayHistoryService: IGameDayHistoryService = {
  create: async (uid: string, entry: IGameDayHistoryEntry): Promise<void> => {
    await db.collection("profiles")      
      .doc(uid)
      .collection("game_day_history")
      .withConverter(gameDayHistoryEntryConverter)
      .add(entry);
  }
}