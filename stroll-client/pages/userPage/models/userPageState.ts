import { defaultProfile, IProfile } from "../../../../stroll-models/profile";
import { defaultProfileGamesStats, IProfileGamesStats } from "../../../../stroll-models/profileStats";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IUserPageState {
  friendID: string;
  profile: IProfile;
  stats: IProfileGamesStats;
  status: RequestStatus;
}

export const defaultUserPageState = (): IUserPageState => ({
  friendID: "",
  profile: defaultProfile(),
  stats: defaultProfileGamesStats(),
  status: RequestStatus.Loading
});