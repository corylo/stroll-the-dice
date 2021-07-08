
import firebase from "firebase-admin";
import { Change, EventContext, logger } from "firebase-functions";

import { db } from "../../firebase";

import { MatchupBatchService } from "./batch/matchupBatchService";
import { MatchupService } from "./matchupService";
import { PlayerService } from "./playerService";
import { PlayerTransactionService } from "./transaction/playerTransactionService";
import { PlayingInBatchService } from "./batch/playingInBatchService";
import { PredictionService } from "./predictionService";
import { StepTrackerService } from "./stepTrackerService";

import { GameDurationUtility } from "../../../stroll-utilities/gameDurationUtility";
import { GameUtility } from "../utilities/gameUtility"
import { MatchupUtility } from "../utilities/matchupUtility";

import { IGame } from "../../../stroll-models/game";
import { IMatchup } from "../../../stroll-models/matchup";
import { IMatchupPairGroup } from "../../../stroll-models/matchupPairGroup";
import { IMatchupSideStepUpdate } from "../../../stroll-models/matchupSideStepUpdate";
import { IPlayer } from "../../../stroll-models/player";
import { IPrediction } from "../../../stroll-models/prediction";

interface IGameService {
  onUpdate: (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext) => Promise<void>;
}

export const GameService: IGameService = {
  onUpdate: async (change: Change<firebase.firestore.QueryDocumentSnapshot<IGame>>, context: EventContext): Promise<void> => {
    const before: IGame = change.before.data(),
      after: IGame = change.after.data();
  
    try {
      if(GameUtility.hasReferenceFieldChanged(before, after)) {
        logger.info(`Updating all references to game [${context.params.id}]`);
        
        const batch: firebase.firestore.WriteBatch = db.batch();
  
        await PlayingInBatchService.update(batch, context.params.id, after);

        const results: firebase.firestore.WriteResult[] = await batch.commit();
  
        logger.info(`Successfully updated ${results.length} references to game [${context.params.id}].`);
      } 
      
      if (GameUtility.upcomingToInProgress(before, after)) {
        logger.info(`Game [${context.params.id}] is now in progress. Generating matchups for days 2 - ${after.duration}`);

        const groups: IMatchupPairGroup[] = MatchupUtility.generatePairGroups(after.duration, after.counts.players),
          players: IPlayer[] = await PlayerService.getByGame(context.params.id),
          matchups: IMatchup[] = MatchupUtility.mapMatchupsFromPairGroups(groups, players);

        logger.info(`Creating [${matchups.length}] matchups for game [${context.params.id}].`);

        await MatchupBatchService.createRemainingMatchups(context.params.id, matchups);
      } else if (GameUtility.stillInProgress(before, after)) {
        const day: number = GameDurationUtility.getDay(after);        

        if(GameDurationUtility.hasDayPassed(after)) {
          logger.info(`Day [${day - 1}] complete for game [${context.params.id}]. Completing matchups and distributing prediction winnings.`);

          let matchups: IMatchup[] = await MatchupService.getByGameAndDay(context.params.id, day - 1);
          
          const predictions: IPrediction[] = await PredictionService.getAllForMatchups(context.params.id, matchups),          
            updates: IMatchupSideStepUpdate[] = await StepTrackerService.getStepCountUpdates(matchups, true);   

          await PlayerTransactionService.distributePayoutsAndFinalizeSteps(context.params.id, matchups, updates, predictions);
        } else {
          logger.info(`Progress update for game [${context.params.id}] on day [${day}].`);

          const matchups: IMatchup[] = await MatchupService.getByGameAndDay(context.params.id, day),            
            updates: IMatchupSideStepUpdate[] = await StepTrackerService.getStepCountUpdates(matchups);

          await PlayerTransactionService.distributePointsAndUpdateSteps(context.params.id, matchups, updates);  
        }
      } else if (GameUtility.inProgressToCompleted(before, after)) {
        logger.info(`Game [${context.params.id}] is now complete.`);
        // Do game completion stuff
      } 
    } catch (err) {
      logger.error(err);
    }
  },
}