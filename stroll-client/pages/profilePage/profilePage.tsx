import React, { useContext, useState } from "react";

import { Button } from "../../components/buttons/button";
import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";
import { ProfilePageSection } from "./components/profilePageSection/profilePageSection";
import { StepTrackerConnectionModal } from "./components/stepTrackerConnectionModal/stepTrackerConnectionModal";
import { StepTrackerHub } from "./components/stepTrackerHub/stepTrackerHub";

import { AppContext } from "../../components/app/contexts/appContext";

import { useInitiateStepTrackerConnectionEffect, useToggleUpdateProfileEffect } from "./effects/profilePageEffects";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { Icon } from "../../../stroll-enums/icon";
import { StepTrackerConnectionStatus } from "../../../stroll-enums/stepTrackerConnectionStatus";

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [toggled, setToggled] = useState<boolean>(false);

  useInitiateStepTrackerConnectionEffect(appState, setToggled, dispatch);

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
            <StepTrackerHub toggleModal={setToggled} />
          </ProfilePageSection>
        </React.Fragment>
      )
    }
  }

  const handleBack = (): void => {
    setToggled(false);

    if(user.profile.tracker.status === StepTrackerConnectionStatus.Disconnected) {
      dispatch(AppAction.ResetStepTrackerConnection);
    } else if (user.profile.tracker.status === StepTrackerConnectionStatus.DisconnectionFailed) {
      location.reload();
    }
  }

  return(
    <Page 
      id="profile-page" 
      backgroundGraphic=""
      requireAuth
    >   
      {getContent()}
      <StepTrackerConnectionModal toggled={toggled} back={handleBack} />
    </Page>
  )
}