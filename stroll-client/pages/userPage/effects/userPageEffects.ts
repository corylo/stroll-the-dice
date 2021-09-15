import { useEffect } from "react";
import { useHistory } from "react-router";

import { ProfileService } from "../../../services/profileService";
import { ProfileStatsService } from "../../../services/profileStatsService";

import { IAppState } from "../../../components/app/models/appState";
import { IProfile } from "../../../../stroll-models/profile";
import { IProfileGamesStats } from "../../../../stroll-models/profileStats";
import { IUserPageState } from "../models/userPageState";

import { AppStatus } from "../../../enums/appStatus";
import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchUserPageDataEffect = (
  appState: IAppState, 
  state: IUserPageState, 
  setState: (state: IUserPageState) => void
): void => {  
  const history: any = useHistory();

  useEffect(() => {
    if(
      appState.status === AppStatus.SignedIn && 
      state.friendID !== "" &&
      appState.user.profile.friendID !== state.friendID
    ) {
      const fetch = async (): Promise<void> => {
        try {
          const profile: IProfile = await ProfileService.get.by.friendID(state.friendID),
            stats: IProfileGamesStats = await ProfileStatsService.getByUID(profile.uid, ProfileStatsID.Games) as IProfileGamesStats;

          setState({ 
            ...state, 
            profile, 
            stats,
            status: RequestStatus.Success 
          });        
        } catch (err) {
          console.error(err);
          
          setState({ ...state, status: RequestStatus.Error });
        }
      }

      fetch();
    }

    if(
      appState.status === AppStatus.SignedIn && 
      appState.user.profile.friendID === state.friendID
    ) {
      history.replace("/profile");
    }
  }, [appState.status, state.friendID]);

}