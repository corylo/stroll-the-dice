import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

import { GameStats } from "../../components/gameStats/gameStats";
import { Page } from "../../components/page/page";
import { PlayerLevelBadge } from "../../components/playerLevelBadge/playerLevelBadge";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchUserPageDataEffect } from "./effects/userPageEffects";

import { UrlUtility } from "../../utilities/urlUtility";

import { defaultUserPageState, IUserPageState } from "./models/userPageState";

import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface UserPageProps {
  
}

export const UserPage: React.FC<UserPageProps> = (props: UserPageProps) => {
  const { appState } = useContext(AppContext);

  const match: any = useRouteMatch();
  
  const [state, setState] = useState<IUserPageState>(defaultUserPageState());

  useEffect(() => {
    const friendID: string = UrlUtility.getParam(match, "id");

    if(friendID) {
      setState({ ...state, friendID });
    }
  }, []);

  useFetchUserPageDataEffect(appState, state, setState);

  const getContent = (): JSX.Element => {
    if(state.status === RequestStatus.Success) {
      return (
        <React.Fragment>
          <ProfileHeader profile={state.profile} /> 
          <PlayerLevelBadge     
            color={state.profile.color}
            experience={state.profile.experience} 
            miniVerbose 
          />
          <GameStats stats={state.stats} />
        </React.Fragment>
      )
    }
  }

  return(
    <Page 
      id="user-page" 
      backgroundGraphic=""
      requireAuth
      status={state.status} 
      errorMessage="Looks like this user does not exist or you do not have access to view their profile!"
    >    
      {getContent()}
    </Page>
  )
}