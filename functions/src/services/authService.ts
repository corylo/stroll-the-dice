import { auth, logger } from "firebase-functions";

import { GameBatchService } from "./batch/gameBatchService";
import { PlayerBatchService } from "./batch/playerBatchService";
import { ProfileBatchService } from "./batch/profileBatchService";
import { StepTrackerService } from "./stepTrackerService";

interface IAuthService {
  onAuthUserDelete: (user: auth.UserRecord) => Promise<void>;
}

export const AuthService: IAuthService = {
  onAuthUserDelete: async (user: auth.UserRecord): Promise<void> => {
    try {
      await ProfileBatchService.deleteProfile(user);
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete profile for user: [${user.uid}].`);
    }

    try {
      await GameBatchService.deleteCreatorFromAllGames(user.uid);
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete creator from all games for user: [${user.uid}].`);
    }

    try {
      await PlayerBatchService.deletePlayerFromAllGames(user.uid);
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete player from all games for user: [${user.uid}].`);
    }

    try {
      await ProfileBatchService.deleteProfileNotifications(user.uid);
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete notifications for user: [${user.uid}].`);
    }
      
    try {
      await StepTrackerService.preauthorizedDisconnectStepTracker(user.uid);
    } catch(err) {
      logger.error(err);
    }
  }
}