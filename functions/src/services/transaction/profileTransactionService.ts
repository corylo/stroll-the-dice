import firebase from "firebase-admin";

import { db } from "../../../config/firebase";

import { GameHistoryUtility } from "../../utilities/gameHistoryUtility";

import { gameConverter, IGame } from "../../../../stroll-models/game";
import { gameHistoryEntryConverter } from "../../../../stroll-models/gameHistoryEntry";
import { IPlayer } from "../../../../stroll-models/player";
import { IProfileGamesStats, IProfileGamesStatsUpdate } from "../../../../stroll-models/profileStats";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IProfileTransactionService {
  handleGameCompletedProfileUpdate: (gameID: string, player: IPlayer) => Promise<void>;
}

export const ProfileTransactionService: IProfileTransactionService = {
  handleGameCompletedProfileUpdate: async (gameID: string, player: IPlayer): Promise<void> => {
    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(gameID)
      .withConverter<IGame>(gameConverter);

    const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(player.id)
      .collection("stats")
      .doc(ProfileStatsID.Games);
      
    const gameHistoryEntryRef: firebase.firestore.DocumentReference = db.collection("profiles")      
      .doc(player.id)
      .collection("game_history")
      .withConverter(gameHistoryEntryConverter)
      .doc();

    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const gameDoc: firebase.firestore.DocumentSnapshot<IGame> = await transaction.get(gameRef),
        game: IGame = { ...gameDoc.data(), id: gameDoc.id };

      const gamesStatsDoc: firebase.firestore.DocumentSnapshot = await transaction.get(gamesStatsRef),
        gamesStats: IProfileGamesStats = gamesStatsDoc.data() as IProfileGamesStats;

      const updates: IProfileGamesStatsUpdate = {
        daysPlayed: gamesStats.daysPlayed + game.duration,
        gamesPlayed: gamesStats.gamesPlayed + 1,
        points: gamesStats.points + player.points.total,
        steps: gamesStats.steps + player.steps
      }

      if(player.place === 1) {
        updates.wins = gamesStats.wins + 1;
      }

      transaction.update(gamesStatsRef, updates);

      transaction.set(gameHistoryEntryRef, GameHistoryUtility.mapCreate(game, player));
    });
  }
}