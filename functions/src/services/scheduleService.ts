import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameUpdate } from "../../../stroll-models/gameUpdate";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface IScheduleService {
  manageGames: (context: EventContext) => Promise<void>;
}

export const ScheduleService: IScheduleService = {
  manageGames: async (context: EventContext): Promise<void> => {
    try {
      const gamesRef: firebase.firestore.Query = db.collection("games")
        .where("startsAt", "<=", Date.now())
        .where("status", "!=", GameStatus.Completed);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const gameSnap: firebase.firestore.QuerySnapshot = await transaction.get(gamesRef);

        if(!gameSnap.empty) {          
          gameSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IGame>) => {
            const game: IGame = { ...doc.data(), id: doc.id },
              updates: IGameUpdate = {};

            if(game.status === GameStatus.Upcoming) {
              updates.status = GameStatus.InProgress;
            } else if (game.status === GameStatus.InProgress && GameDurationUtility.completed(game)) {
              updates.status = GameStatus.Completed;
            }

            

            if(game.status === GameStatus.Upcoming && updates.status === GameStatus.InProgress) {
              // Generate remaining matchups for days 2 thru last day

              // Day 1 matchups
              // 1,2 | 3,4 | 5,6 | 7,8 | 9,10

              // Day 2 matchups
              /*
                - Create list of all possible matchups
                - [1,2|1,3|1,4|etc.] (its called pairwise combinations)
                - Remove day 1 matchups
                - Group matchups by left side player and remove random index from each list.
              */

            } else if (game.status === GameStatus.InProgress && updates.status === GameStatus.InProgress) {
              // Fetch all players and update step counts

              // If current time is 24hrs from startsAt, 
              // -- Fetch all matchups and matchup predictions
              // -- Set winner based on step counts, send funds to players with correct predictions
            }
          });
        }
      });
    } catch (err) {
      logger.error(err);
    }
  }
}