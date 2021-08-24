import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { GameDaySummaryService } from "./gameDaySummaryService";
import { GameEventBatchService } from "./batch/gameEventBatchService";
import { GameEventService } from "./gameEventService";
import { GameTransactionService } from "./transaction/gameTransactionService";
import { MatchupBatchService } from "./batch/matchupBatchService";
import { PlayerBatchService } from "./batch/playerBatchService";
import { PlayerService } from "./playerService";
import { PlayingInBatchService } from "./batch/playingInBatchService";
import { StepTrackerService } from "./stepTrackerService";

import { GameDaySummaryUtility } from "../utilities/gameDaySummaryUtility";
import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { GameEventUtility } from "../utilities/gameEventUtility";
import { MatchupUtility } from "../utilities/matchupUtility";

import { gameConverter, IGame } from "../../../stroll-models/game";
import { IGameDaySummary } from "../../../stroll-models/gameDaySummary";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IPlayer } from "../../../stroll-models/player";
import { IPlayerStepUpdate } from "../../../stroll-models/playerStepUpdate";

import { GameEventType } from "../../../stroll-enums/gameEventType";

interface IGameUpdateService {
  handleInProgressToCompleted: (gameID: string, game: IGame) => Promise<void>;
  handleReferenceFieldChange: (gameID: string, game: IGame) => Promise<void>;
  handleStillInProgress: (gameID: string, game: IGame) => Promise<void>;
  handleUpcomingToInProgress: (gameID: string, game: IGame) => Promise<void>;
  handleUpdateEvent: (gameID: string, before: IGame, after: IGame) => Promise<void>;  
}

export const GameUpdateService: IGameUpdateService = {
  handleInProgressToCompleted: async (gameID: string, game: IGame): Promise<void> => {
    await GameUpdateService.handleStillInProgress(gameID, game);

    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(gameID)
      .withConverter<IGame>(gameConverter);

    const batch: firebase.firestore.WriteBatch = db.batch();

    const players: IPlayer[] = await PlayerService.getByGame(gameID);

    PlayerBatchService.updateGameStatus(batch, players, game.status);

    batch.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });   

    await batch.commit();
    
    logger.info(`Game [${gameID}] is now complete.`);
  },
  handleReferenceFieldChange: async (gameID: string, game: IGame): Promise<void> => {    
    logger.info(`Updating all references to game [${gameID}]`);
    
    const batch: firebase.firestore.WriteBatch = db.batch();

    await PlayingInBatchService.update(batch, gameID, game);

    const results: firebase.firestore.WriteResult[] = await batch.commit();

    logger.info(`Successfully updated ${results.length} references to game [${gameID}].`);
  },
  handleStillInProgress: async (gameID: string, game: IGame): Promise<void> => {    
    const isDayComplete: boolean = GameDurationUtility.isDayComplete(game),
      day: number = GameDurationUtility.getDay(game),
      offsetDay: number = isDayComplete ? day - 1 : day;     
    
    const summary: IGameDaySummary = await GameDaySummaryService.getOrCreate(gameID, offsetDay),
      updates: IPlayerStepUpdate[] = await StepTrackerService.getStepCountUpdates(game.startsAt, summary);
      
    const updatedSummary: IGameDaySummary = GameDaySummaryUtility.mapUpdates(summary, updates);

    if(isDayComplete) {         
      logger.info(`Day [${offsetDay}] complete for game [${gameID}]. Completing matchups and distributing prediction winnings.`);
    
      await GameTransactionService.handleDayCompleteProgressUpdate(gameID, offsetDay, game.startsAt, updatedSummary, updates);
    } else {
      logger.info(`Progress update for game [${gameID}] on day [${offsetDay}].`);

      await GameTransactionService.handleProgressUpdate(gameID, updatedSummary, updates);
    }
  },
  handleUpcomingToInProgress: async (gameID: string, game: IGame): Promise<void> => {
    logger.info(`Game [${gameID}] is now in progress.`);

    const players: IPlayer[] = await PlayerService.getByGame(gameID);

    const batch: firebase.firestore.WriteBatch = db.batch();

    if(game.duration > 1) {
      const groups: IMatchupPairGroup[] = MatchupUtility.generatePairGroups(game.duration, game.counts.players),      
        matchups: IMatchup[] = MatchupUtility.mapMatchupsFromPairGroups(groups, players);

      logger.info(`Generating [${matchups.length}] matchups and predictions for days 2 - ${game.duration}`);      

      MatchupBatchService.createRemainingMatchups(batch, gameID, matchups);
  
      GameEventBatchService.create(batch, gameID, GameEventUtility.mapGeneralEvent(game.startsAt, GameEventType.Started));
    }

    PlayerBatchService.updateGameStatus(batch, players, game.status);

    const gameRef: firebase.firestore.DocumentReference<IGame> = db.collection("games")
      .doc(gameID)
      .withConverter<IGame>(gameConverter);

    batch.update(gameRef, { progressUpdateAt: firebase.firestore.FieldValue.serverTimestamp() });   

    await batch.commit();
  },
  handleUpdateEvent: async (gameID: string, before: IGame, after: IGame): Promise<void> => {    
    await GameEventService.create(gameID, GameEventUtility.mapUpdateEvent(after.updatedAt, before, after));
  }
}