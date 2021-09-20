import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { ProfileStatsService } from "./profileStatsService";

import { IMatchup, matchupConverter } from "../../../stroll-models/matchup";
import { IMatchupSpread } from "../../../stroll-models/matchupSpread";
import { IProfileGamesStats } from "../../../stroll-models/profileStats";

import { ProfileStatsID } from "../../../stroll-enums/profileStatsID";

interface IMatchupService {
  createSpread: (gameID: string, matchupID: string,  spread: IMatchupSpread) => Promise<void>;
  getByGameAndDay: (id: string, day: number) => Promise<IMatchup[]>;
  getSpread: (leftUID: string, rightUID: string) => Promise<IMatchupSpread>;
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IMatchup>>, context: EventContext) => Promise<void>;  
}

export const MatchupService: IMatchupService = {
  createSpread: async (gameID: string, matchupID: string, spread: IMatchupSpread): Promise<void> => {
    await db.collection("games")
      .doc(gameID)
      .collection("matchups")
      .doc(matchupID)
      .update({ 
        favoriteID: spread.favoriteID, 
        spread: spread.amount,
        spreadCreatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  },
  getByGameAndDay: async (id: string, day: number): Promise<IMatchup[]> => {    
    const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
      .doc(id)
      .collection("matchups")
      .where("day", "==", day)
      .orderBy("createdAt")
      .withConverter(matchupConverter)
      .get();

    let matchups: IMatchup[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
      matchups.push(doc.data()));
    
    return matchups;
  },
  getSpread: async (leftUID: string, rightUID: string): Promise<IMatchupSpread> => {
    const leftProfileGameStats: IProfileGamesStats = await ProfileStatsService.getByUID(leftUID, ProfileStatsID.Games) as IProfileGamesStats,
      rightProfileGameStats: IProfileGamesStats = await ProfileStatsService.getByUID(rightUID, ProfileStatsID.Games) as IProfileGamesStats;

    const spread: IMatchupSpread = {
      amount: 0,
      favoriteID: ""
    }

    if(leftProfileGameStats.daysPlayed >= 3 && rightProfileGameStats.daysPlayed >= 3) {
      const leftDailyValue: number = Math.round(leftProfileGameStats.steps / leftProfileGameStats.daysPlayed),
        rightDailyValue: number = Math.round(rightProfileGameStats.steps / rightProfileGameStats.daysPlayed);

      if(leftDailyValue >= 300 && rightDailyValue >= 300) {
        spread.amount = Math.abs(leftDailyValue - rightDailyValue);
        
        if(rightDailyValue !== leftDailyValue) {
          spread.favoriteID = rightDailyValue > leftDailyValue ? rightUID : leftUID;
        }
      }
    }

    return spread;
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const matchup: IMatchup = { ...snapshot.data() as IMatchup, id: snapshot.id };

    const { left, right } = matchup;

    if(left.playerID !== "" && right.playerID !== "") {      
      try {
        const spread: IMatchupSpread = await MatchupService.getSpread(left.playerID, right.playerID);

        await MatchupService.createSpread(context.params.gameID, context.params.matchupID, spread);
      } catch (err) {
        logger.error(err);
      }
    }
  },
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IMatchup>>, context: EventContext): Promise<void> => {
    const before: IMatchup = change.before.data(),
      after: IMatchup = change.after.data();

    if(before.right.playerID === "" && after.right.playerID !== "") {
      try {
        const { left, right } = after;

        const spread: IMatchupSpread = await MatchupService.getSpread(left.playerID, right.playerID);

        await MatchupService.createSpread(context.params.gameID, context.params.matchupID, spread);
      } catch (err) {
        logger.error(err);
      }
    }
  }
}