import { auth, logger } from "firebase-functions";

import { PlayerBatchService } from "./batch/playerBatchService";
import { ProfileBatchService } from "./batch/profileBatchService";

interface IAuthService {
  onAuthUserDelete: (user: auth.UserRecord) => Promise<void>;
}

export const AuthService: IAuthService = {
  onAuthUserDelete: async (user: auth.UserRecord): Promise<void> => {
    try {
      await ProfileBatchService.deleteProfile(user);

      await PlayerBatchService.deletePlayerFromAllGames();
    } catch(err) {
      logger.error(err);

      logger.error(`Unable to delete profile for user: [${user.displayName}].`);
    }
  }
}