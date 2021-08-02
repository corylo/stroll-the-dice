import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";
import { ProfilePageSection } from "./components/profilePageSection/profilePageSection";
import { StepTrackerHub } from "./components/stepTrackerHub/stepTrackerHub";

import { AppContext } from "../../components/app/contexts/appContext";

import { useConnectStepTrackerEffect, useToggleUpdateProfileEffect } from "./effects/profilePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { Graphic } from "../../../stroll-enums/graphic";
import { Icon } from "../../../stroll-enums/icon";

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useConnectStepTrackerEffect(appState, dispatch);

  useToggleUpdateProfileEffect(appState, dispatch);

  const getContent = (): JSX.Element => {
    if(status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <ProfileHeader profile={user.profile} />
          <ProfilePageSection icon={Icon.Steps} title="Connect Step Trackers">
            <StepTrackerHub />
          </ProfilePageSection>
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