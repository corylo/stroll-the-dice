import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";

import { AppContext } from "../../components/app/contexts/appContext";

import { useConnectStepTrackerEffect } from "./effects/profilePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useConnectStepTrackerEffect(appState, dispatch);

  const getContent = (): JSX.Element => {
    if(status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <ProfileHeader profile={user.profile} />
        </React.Fragment>
      )
    }
  }

  return(
    <Page 
      id="profile-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.CityWalk)} 
      requireAuth
    >   
      {getContent()}
    </Page>
  )
}