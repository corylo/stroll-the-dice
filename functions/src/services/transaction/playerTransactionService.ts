import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { GameEventTransactionService } from "./gameEventTransactionService";
import { PredictionTransactionService } from "./predictionTransactionService";

import { GameDaySummaryUtility } from "../../utilities/gameDaySummaryUtility";
import { MatchupUtility } from "../../utilities/matchupUtility";
import { PointsUtility } from "../../utilities/pointsUtility";

import { IMatchup, IMatchupSideTotal } from "../../../../stroll-models/matchup";
import { IPlayer } from "../../../../stroll-models/player";
import { IPlayerStepUpdate } from "../../../../stroll-models/playerStepUpdate";

import { InitialValue } from "../../../../stroll-enums/initialValue";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  handlePlayerEarnedPointsForSteps: (transaction: firebase.firestore.Transaction, gameID: string, doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>, updates: IPlayerStepUpdate[]) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer) => IMatchup;
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer) => void;      
}

export const PlayerTransactionService: IPlayerTransactionService = {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer): void => {
    const matchups: IMatchup[] = [];

    if(!matchupSnap.empty) {
      matchupSnap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IMatchup>) => 
        matchups.push(doc.data()));
    }

    if(matchups.length === 0 || matchups[0].right.playerID !== "") {    
      PlayerTransactionService.createDayOneMatchup(transaction, player);
    } else {
      const matchup: IMatchup = PlayerTransactionService.completeDayOneMatchup(transaction, matchups[0], player);

      PredictionTransactionService.createInitialPredictions(transaction, player.ref.game, matchup.id, matchup.left.playerID, player.id);
    }
  },
  handlePlayerEarnedPointsForSteps: (transaction: firebase.firestore.Transaction, gameID: string, doc: firebase.firestore.QueryDocumentSnapshot<IPlayer>, updates: IPlayerStepUpdate[]): void => {
    const player: IPlayer = doc.data(),
      steps: number = GameDaySummaryUtility.findUpdateForPlayer(player.id, updates);

    if(steps > 0) {
      const updatedPlayer: IPlayer = PointsUtility.mapPointsForSteps(player, steps);

      transaction.update(doc.ref, {
        points: updatedPlayer.points,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      GameEventTransactionService.sendPlayerEarnedPointsFromStepsEvent(transaction, gameID, updatedPlayer.id, steps);
    }
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer): IMatchup => {    
    logger.info(`Completing matchup [${matchup.id}] for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game, matchup.id);

    const total: IMatchupSideTotal = {
      participants: 1,
      wagered: InitialValue.InitialPredictionPoints
    };
    
    transaction.update(matchupRef, { 
      ["left.total"]: total,
      ["right.total"]: total,
      ["right.playerID"]: player.id
    });

    return matchup;
  },
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    logger.info(`Creating matchup for player [${player.id}] in game [${player.ref.game}].`);

    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game);

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
  }
}