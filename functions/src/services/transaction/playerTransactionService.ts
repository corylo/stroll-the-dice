import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../../firebase";

import { MatchupUtility } from "../../utilities/matchupUtility";
import { PredictionUtility } from "../../utilities/predictionUtility";

import { IGame } from "../../../../stroll-models/game";
import { IMatchup, matchupConverter } from "../../../../stroll-models/matchup";
import { IPlayer, playerConverter } from "../../../../stroll-models/player";
import { IPrediction } from "../../../../stroll-models/prediction";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;  
  distributePayoutsAndFinalizeSteps: (gameID: string, matchups: IMatchup[], predictions: IPrediction[]) => Promise<void>;
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer) => void;  
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, game: IGame, player: IPlayer): void => {
    if(matchupSnap.empty || game.counts.players % 2 === 0) {
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else if (matchupSnap.docs.length === 1) {
      PlayerTransactionService.completeDayOneMatchup(transaction, matchupSnap, player);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): void => {      
    const matchups: IMatchup[] = [];

    matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
      matchups.push({ ...doc.data(), id: doc.id }));

    const matchup: IMatchup = matchups[0];

    logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(player.ref.game)
      .collection("matchups")
      .withConverter<IMatchup>(matchupConverter)
      .doc(matchup.id);

    transaction.update(matchupRef, { ["right.ref"]: player.id });
  },
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
      .doc(player.ref.game)
      .collection("matchups")
      .withConverter<IMatchup>(matchupConverter)
      .doc();

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
  },
  distributePayoutsAndFinalizeSteps: async (gameID: string, matchups: IMatchup[], predictions: IPrediction[]): Promise<void> => {
    try {
      const playersRef: firebase.firestore.Query = db.collection("games")
        .doc(gameID)
        .collection("players")
        .withConverter(playerConverter);

      await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const playerSnap: firebase.firestore.QuerySnapshot = await transaction.get(playersRef);

        if(!playerSnap.empty) {          
          let players: IPlayer[] = [];

          playerSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>) => 
            players.push(doc.data()));

          players.forEach((player: IPlayer) => {
            const payout: number = PredictionUtility.determinePayoutForPlayer(player.id, matchups, predictions);

            if(payout > 0) {
              const playerRef: firebase.firestore.DocumentReference = db.collection("games")
                .doc(gameID)
                .collection("players")
                .doc(player.id)
                .withConverter(playerConverter);

              transaction.update(playerRef, { 
                funds: player.funds + payout, 
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
              });
            }
          }); 
          
          matchups.forEach((matchup: IMatchup) => {      
            const matchupRef: firebase.firestore.DocumentReference = db.collection("games")
              .doc(gameID)
              .collection("matchups")
              .doc(matchup.id)
              .withConverter(matchupConverter);

            transaction.update(matchupRef, matchup);
          });
        }
      });
    } catch (err) {
      logger.error(err);
    }
  },
  updateCounts: (transaction: firebase.firestore.Transaction, gameRef: firebase.firestore.DocumentReference, game: IGame, player: IPlayer): void => {      
    if(player.id !== game.creator.uid) { 
      transaction.update(gameRef, { ["counts.players"]: firebase.firestore.FieldValue.increment(1) });

      const inviteRef: firebase.firestore.DocumentReference = db.collection("games")
        .doc(player.ref.game)
        .collection("invites")
        .doc(player.ref.invite);
        
      transaction.update(inviteRef, { ["uses.current"]: firebase.firestore.FieldValue.increment(1) });
    }
  }
}