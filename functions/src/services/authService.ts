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

      await GameBatchService.deleteCreatorFromAllGames(user.uid);

      await PlayerBatchService.deletePlayerFromAllGames(user.uid);
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete profile for user: [${user.displayName}].`);
    }
      
    try {
      await StepTrackerService.preauthorizedDisconnectStepTracker(user.uid);
    } catch(err) {
      logger.error(err);
    }
  }
}