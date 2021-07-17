
import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../firebase";

import { FirestoreDateUtility } from "../utilities/firestoreDateUtility";
import { GameEventService } from "./gameEventService";
import { MatchupBatchService } from "./batch/matchupBatchService";
import { MatchupService } from "./matchupService";
import { PlayerBatchService } from "./batch/playerBatchService";
import { PlayerService } from "./playerService";
import { PlayerTransactionService } from "./transaction/playerTransactionService";
import { PlayingInBatchService } from "./batch/playingInBatchService";
import { PredictionBatchService } from "./batch/predictionBatchService";
import { PredictionService } from "./predictionService";
import { StepTrackerService } from "./stepTrackerService";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { GameEventUtility } from "../utilities/gameEventUtility";
import { MatchupUtility } from "../utilities/matchupUtility";

import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";
import { IPrediction } from "../../../stroll-models/prediction";

interface IGameUpdateService {
  handleDayPassing: (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  handleInProgressToCompleted: (gameID: string, game: IGame) => Promise<void>;
  handleProgressUpdate: (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  handleReferenceFieldChange: (gameID: string, game: IGame) => Promise<void>;
  handleStillInProgress: (gameID: string, game: IGame) => Promise<void>;
  handleUpcomingToInProgress: (gameID: string, game: IGame) => Promise<void>;
  handleUpdateEvent: (gameID: string, before: IGame, after: IGame) => Promise<void>;
}

export const GameUpdateService: IGameUpdateService = {
  handleDayPassing: async (gameID: string, day: number, startsAt: firebase.firestore.FieldValue, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {     
    logger.info(`Day [${day}] complete for game [${gameID}]. Completing matchups and distributing prediction winnings.`);
    
    const dayCompletedAt: firebase.firestore.FieldValue = FirestoreDateUtility.endOfDay(day, startsAt);

    await GameEventService.create(gameID, GameEventUtility.mapDayCompletedEvent(dayCompletedAt, day));
         
    const predictions: IPrediction[] = await PredictionService.getAllForMatchups(gameID, matchups);   

    await PlayerTransactionService.distributePayoutsAndFinalizeSteps(
      gameID, 
      day, 
      dayCompletedAt,
      matchups, 
      updates, 
      predictions
    );
  },
  handleInProgressToCompleted: async (gameID: string, game: IGame): Promise<void> => {
    await GameUpdateService.handleStillInProgress(gameID, game);
    
    logger.info(`Game [${gameID}] is now complete.`);

    const batch: firebase.firestore.WriteBatch = db.batch();

    const players: IPlayer[] = await PlayerService.getByGame(gameID);

    PlayerBatchService.updateGameStatus(batch, players, game.status);

    await batch.commit();
  },
  handleProgressUpdate: async (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {
    logger.info(`Progress update for game [${gameID}] on day [${day}].`);

    await PlayerTransactionService.distributePointsAndUpdateSteps(gameID, matchups, updates);  
  },
  handleReferenceFieldChange: async (gameID: string, game: IGame): Promise<void> => {    
    logger.info(`Updating all references to game [${gameID}]`);
    
    const batch: firebase.firestore.WriteBatch = db.batch();

    await PlayingInBatchService.update(batch, gameID, game);

    const results: firebase.firestore.WriteResult[] = await batch.commit();

    logger.info(`Successfully updated ${results.length} references to game [${gameID}].`);
  },
  handleStillInProgress: async (gameID: string, game: IGame): Promise<void> => {
    const hasDayPassed: boolean = GameDurationUtility.hasDayPassed(game),
      currentDay: number = GameDurationUtility.getDay(game),          
      day: number = hasDayPassed ? currentDay - 1 : currentDay;     
        
    const matchups: IMatchup[] = await MatchupService.getByGameAndDay(gameID, day),
      updates: IMatchupSideStepUpdate[] = await StepTrackerService.getStepCountUpdates(game, matchups);

    if(hasDayPassed) {         
      await GameUpdateService.handleDayPassing(gameID, day, game.startsAt, matchups, updates);
    } else {
      await GameUpdateService.handleProgressUpdate(gameID, day, matchups, updates);
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
  
      PredictionBatchService.createInitialPredictions(batch, gameID, matchups);
    }

    PlayerBatchService.updateGameStatus(batch, players, game.status);

    await batch.commit();
  },
  handleUpdateEvent: async (gameID: string, before: IGame, after: IGame): Promise<void> => {    
    await GameEventService.create(gameID, GameEventUtility.mapUpdateEvent(after.updatedAt, before, after));
  }
}