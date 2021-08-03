import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { IGameDayStatsUpdate } from "../../../../stroll-models/gameDayStatsUpdate";
import { IProfileGameDayStats } from "../../../../stroll-models/profileStats";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IGameDayStatsTransactionService {
  updateAvailableAndTotal: (uid: string, update: IGameDayStatsUpdate) => Promise<void>;
}

export const GameDayStatsTransactionService: IGameDayStatsTransactionService = {
  updateAvailableAndTotal: async (uid: string, update: IGameDayStatsUpdate): Promise<void> => {
    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const ref: firebase.firestore.DocumentReference = db.collection("profiles")      
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.GameDays);
      
      const doc: firebase.firestore.DocumentSnapshot = await transaction.get(ref);

      if(doc.exists) {
        const stats: IProfileGameDayStats = doc.data() as IProfileGameDayStats;

        transaction.update(ref, {
          available: stats.available + update.available,
          total: stats.total + update.total
        })
      } else {
        throw new Error(`Document with Profile Stats ID: [${ProfileStatsID.GameDays}] does not exist for user: [${uid}]`);
      }
    });
  }
}