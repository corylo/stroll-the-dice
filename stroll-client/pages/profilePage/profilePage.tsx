import React, { useContext } from "react";

import { Button } from "../../components/buttons/button";
import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";
import { ProfilePageSection } from "./components/profilePageSection/profilePageSection";
import { StepTrackerHub } from "./components/stepTrackerHub/stepTrackerHub";

import { AppContext } from "../../components/app/contexts/appContext";

import { useConnectStepTrackerEffect, useToggleUpdateProfileEffect } from "./effects/profilePageEffects";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
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
          <ProfilePageSection icon={Icon.User} title="Action Center">
            <Button
              className="action-center-button fancy-button"
              handleOnClick={() => dispatch(AppAction.ToggleUpdateProfile, true)} 
            >
              <i className="fal fa-pencil" />
              <h1 className="passion-one-font">Edit Profile</h1>
            </Button>
            <Button
              className="action-center-button fancy-button red"
              handleOnClick={() => dispatch(AppAction.ToggleDeleteAccount, true)} 
            >
              <i className="far fa-trash-alt" />
              <h1 className="passion-one-font">Delete Account Forever</h1>
            </Button>
          </ProfilePageSection>
          <ProfilePageSection icon={Icon.Steps} title="Step Trackers">
            <StepTrackerHub />
          </ProfilePageSection>
        </React.Fragment>
      )
    }
  }

  return(
    <Page 
      id="profile-page" 
      backgroundGraphic=""
      requireAuth
    >   
      {getContent()}
    </Page>
  )
}