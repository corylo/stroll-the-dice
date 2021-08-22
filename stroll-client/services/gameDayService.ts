import { functions } from "../config/firebase";

import { IGiftGameDaysRequest } from "../../stroll-models/giftGameDaysRequest";

interface IGameDayService {
  gift: (request: IGiftGameDaysRequest) => Promise<void>;
}

export const GameDayService: IGameDayService = {
  gift: async (request: IGiftGameDaysRequest): Promise<void> => {
    await functions.httpsCallable("giftGameDays")(request);
  }
}