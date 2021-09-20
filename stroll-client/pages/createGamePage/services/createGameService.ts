import firebase from "firebase/app";

import { db } from "../../../config/firebase";

import { gameConverter, IGame } from "../../../../stroll-models/game";
import { IGameDayStatsUpdate } from "../../../../stroll-models/gameDayStatsUpdate";
import { IInvite, inviteConverter } from "../../../../stroll-models/invite";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IProfileGameDayStats } from "../../../../stroll-models/profileStats";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface ICreateGameService {
  createGame: (game: IGame, player: IPlayer, invite: IInvite) => Promise<void>;
}

export const CreateGameService: ICreateGameService = {
  createGame: async (game: IGame, player: IPlayer, invite: IInvite): Promise<void> => {
    return await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const gameDaysStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
        .doc(game.creatorUID)
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

          const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
            .doc(game.id)
            .withConverter<IGame>(gameConverter);
      
          transaction.set(gameRef, game);
      
          const inviteRef: firebase.firestore.DocumentReference<IInvite> = db
            .collection("games")
            .doc(game.id)
            .collection("invites")
            .doc(invite.id)
            .withConverter(inviteConverter);
      
          transaction.set(inviteRef, invite);
      
          const playerRef: firebase.firestore.DocumentReference = db.collection("games")
            .doc(game.id)
            .collection("players")
            .doc(game.creatorUID)
            .withConverter(playerConverter);
      
          transaction.set(playerRef, player);  
          
          const gamesStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
            .doc(game.creatorUID)
            .collection("stats")
            .doc(ProfileStatsID.Games);

          transaction.update(gamesStatsRef, { lastCreated: game.id });
        } else {
          throw new Error(`${game.duration} Game Days required to create this game. User only has ${stats.available} Game Days available.`);  
        }
      } else {
        throw new Error("Missing Game Days stats.");
      }
    });
  }
}