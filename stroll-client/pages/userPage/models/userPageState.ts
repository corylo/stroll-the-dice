import { defaultProfile, IProfile } from "../../../../stroll-models/profile";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export interface IUserPageState {
  profile: IProfile;
  status: RequestStatus;
}

export const defaultUserPageState = (): IUserPageState => ({
  profile: defaultProfile(),
  status: RequestStatus.Loading
});