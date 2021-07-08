
import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../firebase";

import { MatchupBatchService } from "./batch/matchupBatchService";
import { PlayerService } from "./playerService";
import { PlayerTransactionService } from "./transaction/playerTransactionService";
import { PlayingInBatchService } from "./batch/playingInBatchService";
import { PredictionService } from "./predictionService";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { GameUtility } from "../utilities/gameUtility";
import { MatchupUtility } from "../utilities/matchupUtility";

import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";
import { IPrediction } from "../../../stroll-models/prediction";
import { MatchupService } from "./matchupService";
import { StepTrackerService } from "./stepTrackerService";

interface IGameUpdateService {
  handleDayPassing: (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  handleProgressUpdate: (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]) => Promise<void>;
  handleReferenceFieldChange: (gameID: string, before: IGame, after: IGame) => Promise<void>;
  handleStillInProgress: (gameID: string, game: IGame) => Promise<void>;
  handleUpcomingToInProgress: (gameID: string, game: IGame) => Promise<void>;
}

export const GameUpdateService: IGameUpdateService = {
  handleDayPassing: async (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {     
    logger.info(`Day [${day}] complete for game [${gameID}]. Completing matchups and distributing prediction winnings.`);

    const predictions: IPrediction[] = await PredictionService.getAllForMatchups(gameID, matchups);   

    await PlayerTransactionService.distributePayoutsAndFinalizeSteps(gameID, matchups, updates, predictions);
  },
  handleProgressUpdate: async (gameID: string, day: number, matchups: IMatchup[], updates: IMatchupSideStepUpdate[]): Promise<void> => {
    logger.info(`Progress update for game [${gameID}] on day [${day}].`);

    await PlayerTransactionService.distributePointsAndUpdateSteps(gameID, matchups, updates);  
  },
  handleReferenceFieldChange: async (gameID: string, before: IGame, after: IGame): Promise<void> => {    
    if(GameUtility.hasReferenceFieldChanged(before, after)) {
      logger.info(`Updating all references to game [${gameID}]`);
      
      const batch: firebase.firestore.WriteBatch = db.batch();

      await PlayingInBatchService.update(batch, gameID, after);

      const results: firebase.firestore.WriteResult[] = await batch.commit();

      logger.info(`Successfully updated ${results.length} references to game [${gameID}].`);
    } 
  },
  handleStillInProgress: async (gameID: string, game: IGame): Promise<void> => {
    const hasDayPassed: boolean = GameDurationUtility.hasDayPassed(game),
      currentDay: number = GameDurationUtility.getDay(game),          
      day: number = hasDayPassed ? currentDay - 1 : currentDay;     
        
    const matchups: IMatchup[] = await MatchupService.getByGameAndDay(gameID, day),
      updates: IMatchupSideStepUpdate[] = await StepTrackerService.getStepCountUpdates(game, matchups);

    if(hasDayPassed) {          
      GameUpdateService.handleDayPassing(gameID, day, matchups, updates);
    } else {
      GameUpdateService.handleProgressUpdate(gameID, day, matchups, updates);
    }
  },
  handleUpcomingToInProgress: async (gameID: string, game: IGame): Promise<void> => {
    logger.info(`Game [${gameID}] is now in progress. Generating matchups for days 2 - ${game.duration}`);

    const groups: IMatchupPairGroup[] = MatchupUtility.generatePairGroups(game.duration, game.counts.players),
      players: IPlayer[] = await PlayerService.getByGame(gameID),
      matchups: IMatchup[] = MatchupUtility.mapMatchupsFromPairGroups(groups, players);

    logger.info(`Creating [${matchups.length}] matchups for game [${gameID}].`);

    await MatchupBatchService.createRemainingMatchups(gameID, matchups);
  }
}