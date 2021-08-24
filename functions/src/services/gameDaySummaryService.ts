import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { MatchupService } from "./matchupService";

import { GameDaySummaryUtility } from "../utilities/gameDaySummaryUtility";

import { gameDaySummaryConverter, IGameDaySummary } from "../../../stroll-models/gameDaySummary";

import { IMatchup } from "../../../stroll-models/matchup";

interface IGameDaySummaryService {
  create: (gameID: string, summary: IGameDaySummary) => Promise<void>;
  get: (gameID: string, day: number) => Promise<IGameDaySummary>;
  getOrCreate: (gameID: string, day: number) => Promise<IGameDaySummary>;
}

export const GameDaySummaryService: IGameDaySummaryService = {
  create: async (gameID: string, summary: IGameDaySummary): Promise<void> => {
    await db.collection("games")
      .doc(gameID)
      .collection("day_summaries")
      .doc(summary.day.toString())
      .withConverter(gameDaySummaryConverter)
      .set(summary);
  },
  get: async (gameID: string, day: number): Promise<IGameDaySummary> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("games")
      .doc(gameID)
      .collection("day_summaries")
      .doc(day.toString())
      .withConverter(gameDaySummaryConverter)
      .get();

    if(doc.exists) {
      return doc.data() as IGameDaySummary;
    }

    return null;
  },
  getOrCreate: async (gameID: string, day: number): Promise<IGameDaySummary> => {
    const summary: IGameDaySummary = await GameDaySummaryService.get(gameID, day);

    if(summary !== null) {
      return summary;
    }

    const matchups: IMatchup[] = await MatchupService.getByGameAndDay(gameID, day),
      newSummary: IGameDaySummary = GameDaySummaryUtility.mapCreate(day, matchups);

    await GameDaySummaryService.create(gameID, newSummary);

    return newSummary;
  }
}