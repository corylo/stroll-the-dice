import firebase from "firebase/app";

import { db } from "../../../../../config/firebase";

import { IGameDayStatsUpdate } from "../../../../../../stroll-models/gameDayStatsUpdate";
import { IProfileGameDayStats } from "../../../../../../stroll-models/profileStats";

import { gameConverter, IGame } from "../../../../../../stroll-models/game";
import { inviteConverter } from "../../../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../../../stroll-models/player";

import { ProfileStatsID } from "../../../../../../stroll-enums/profileStatsID";

interface IAcceptInviteService {
  acceptInvite: (game: IGame, player: IPlayer) => Promise<void>;
}

export const AcceptInviteService: IAcceptInviteService = {
  acceptInvite: async (game: IGame, player: IPlayer): Promise<void> => {
    return await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const gameDaysStatsPlayerID: string = player.ref.acceptedGiftDays ? game.creatorUID : player.id;

      const gameDaysStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
        .doc(gameDaysStatsPlayerID)
        .collection("stats")
        .doc(ProfileStatsID.GameDays);
      
      const doc: firebase.firestore.DocumentSnapshot = await transaction.get(gameDaysStatsRef);

      if(doc.exists) {
        const stats: IProfileGameDayStats = doc.data() as IProfileGameDayStats;
          
        if(stats.available >= game.duration) {
          const update: IGameDayStatsUpdate = { 
            available: stats.available - game.duration,
            redeemed: stats.redeemed + game.duration
          };

          transaction.update(gameDaysStatsRef, update);

          const gameRef: firebase.firestore.DocumentReference = db.collection("games")      
            .doc(game.id)
            .withConverter(gameConverter);

          transaction.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

          const playerRef: firebase.firestore.DocumentReference = db.collection("games")      
            .doc(game.id)
            .collection("players")
            .doc(player.id)
            .withConverter(playerConverter);

          transaction.set(playerRef, player);

          const inviteRef: firebase.firestore.DocumentReference = db.collection("games")      
            .doc(game.id)
            .collection("invites")
            .doc(player.ref.invite)
            .withConverter(inviteConverter);

          transaction.update(inviteRef, { 
            ["uses.current"]: firebase.firestore.FieldValue.increment(1),
            lastUsedAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          const playingInRef: firebase.firestore.DocumentReference = db.collection("profiles")
            .doc(player.id)
            .collection("playing_in")
            .doc(game.id);

          transaction.set(playingInRef, { 
            id: game.id,
            name: game.name.toLowerCase(), 
            startsAt: game.startsAt,
            status: game.status,
            endsAt: game.endsAt
          });

          const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
            .doc(player.id)
            .collection("stats")
            .doc(ProfileStatsID.Games);

          transaction.update(gamesStatsRef, { lastJoined: game.id });
        } else {
          throw new Error(`${game.duration} Game Days required to join this game. User only has ${stats.available} Game Days available.`);  
        }
      } else {
        throw new Error("Missing Game Days stats.");
      }
    });
  }
}