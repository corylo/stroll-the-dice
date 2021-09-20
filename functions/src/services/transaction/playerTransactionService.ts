import firebase from "firebase-admin";

import { GameEventTransactionService } from "./gameEventTransactionService";

import { FirestoreDateUtility } from "../../utilities/firestoreDateUtility";
import { GameDaySummaryUtility } from "../../utilities/gameDaySummaryUtility";
import { GameEventUtility } from "../../utilities/gameEventUtility";
import { MatchupUtility } from "../../utilities/matchupUtility";
import { PlayerUtility } from "../../utilities/playerUtility";

import { IMatchup } from "../../../../stroll-models/matchup";
import { IPlayer } from "../../../../stroll-models/player";
import { IPlayerDayCompletedSummary } from "../../../../stroll-models/playerDayCompletedSummary";
import { IPlayerStepUpdate } from "../../../../stroll-models/playerStepUpdate";
import { IPrediction } from "../../../../stroll-models/prediction";

interface IPlayerTransactionService {
  handleMatchup: (transaction: firebase.firestore.Transaction, matchupSnap: firebase.firestore.QuerySnapshot, player: IPlayer) => void;
  handlePlayerEarnedPointsAtEndOfDay: (
    transaction: firebase.firestore.Transaction, 
    gameID: string, 
    playerSnap: firebase.firestore.QuerySnapshot, 
    matchups: IMatchup[],
    predictions: IPrediction[],
    updates: IPlayerStepUpdate[], 
    day: number,
    dayCompletedAt: firebase.firestore.FieldValue
  ) => void;
  handlePlayerEarnedPointsForSteps: (transaction: firebase.firestore.Transaction, gameID: string, playerSnap: firebase.firestore.QuerySnapshot, updates: IPlayerStepUpdate[]) => void;
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer) => void;
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
      PlayerTransactionService.completeDayOneMatchup(transaction, matchups[0], player);
    }
  },
  handlePlayerEarnedPointsAtEndOfDay: (
    transaction: firebase.firestore.Transaction, 
    gameID: string, 
    playerSnap: firebase.firestore.QuerySnapshot, 
    matchups: IMatchup[],
    predictions: IPrediction[],
    updates: IPlayerStepUpdate[], 
    day: number,
    dayCompletedAt: firebase.firestore.FieldValue
  ): void => {
    const players: IPlayer[] = PlayerUtility.mapPlayerEarnedPointsForStepsUpdates(playerSnap, updates);

    PlayerUtility.mapPlayerEarnedPointsAtEndOfDayUpdates(players, day, matchups, predictions).forEach((player: IPlayer) => {
      const doc: firebase.firestore.QueryDocumentSnapshot = playerSnap.docs.find((doc: firebase.firestore.QueryDocumentSnapshot) => doc.id === player.id),
        steps: number = GameDaySummaryUtility.findUpdateForPlayer(player.id, updates);

      if(player.steps > 0) {
        GameEventTransactionService.sendPlayerEarnedPointsFromStepsEvent(transaction, gameID, player.id, steps);
      }

      transaction.update(doc.ref, { 
        place: player.place,
        points: player.points, 
        steps: player.steps,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp() 
      });
      
      const playerSummary: IPlayerDayCompletedSummary = GameDaySummaryUtility.mapPlayerDayCompletedSummary(
        day, 
        doc.id, 
        player.place,
        matchups, 
        predictions
      );
      
      GameEventTransactionService.create(
        transaction, 
        gameID, 
        GameEventUtility.mapPlayerDayCompletedSummaryEvent(doc.id, FirestoreDateUtility.addMillis(dayCompletedAt, 1), playerSummary)
      );
    });
  },
  handlePlayerEarnedPointsForSteps: (transaction: firebase.firestore.Transaction, gameID: string, playerSnap: firebase.firestore.QuerySnapshot, updates: IPlayerStepUpdate[]): void => {
    PlayerUtility.mapPlayerEarnedPointsForStepsUpdates(playerSnap, updates).forEach((player: IPlayer) => {
      const doc: firebase.firestore.QueryDocumentSnapshot = playerSnap.docs.find((doc: firebase.firestore.QueryDocumentSnapshot) => doc.id === player.id),
        steps: number = GameDaySummaryUtility.findUpdateForPlayer(doc.id, updates);
        
      transaction.update(doc.ref, {
        place: player.place,
        points: player.points,
        steps: player.steps,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      if(steps > 0) {
        GameEventTransactionService.sendPlayerEarnedPointsFromStepsEvent(transaction, gameID, doc.id, steps);
      }
    });
  },
  completeDayOneMatchup: (transaction: firebase.firestore.Transaction, matchup: IMatchup, player: IPlayer): void => {    
    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game, matchup.id);

    const leftSideSpread: number = 0,
      rightSideSpread: number = 0;

    transaction.update(matchupRef, { 
      ["left.spread"]: leftSideSpread,
      ["right.spread"]: rightSideSpread,
      ["right.playerID"]: player.id
    });
  },
  createDayOneMatchup: (transaction: firebase.firestore.Transaction, player: IPlayer): void => {
    const matchupRef: firebase.firestore.DocumentReference = MatchupUtility.getMatchupRef(player.ref.game);

    transaction.set(matchupRef, MatchupUtility.mapCreate(player.id, "", 1));
  }
}