import React, { createContext, useContext, useState } from "react";

import { ActionCenterSection } from "./components/actionCenterSection/actionCenterSection";
import { EmailNotificationSettingsSection } from "./components/emailNotificationSettingsSection/emailNotificationSettingsSection";
import { FriendCodeSection } from "./components/friendCodeSection/friendCodeSection";
import { Page } from "../../components/page/page";
import { PlayerLevelBadge } from "../../components/playerLevelBadge/playerLevelBadge";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";
import { StepTrackerConnectionModal } from "./components/stepTrackerConnectionModal/stepTrackerConnectionModal";
import { StepTrackerSection } from "./components/stepTrackerSection/stepTrackerSection";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchEmailSettingsEffect, useInitiateStepTrackerConnectionEffect } from "./effects/profilePageEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { MetaUtility } from "../../utilities/metaUtility";

import { defaultProfilePageState, IProfilePageState } from "./models/profilePageState";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { StepTrackerConnectionStatus } from "../../../stroll-enums/stepTrackerConnectionStatus";

interface IProfilePageContext {
  state: IProfilePageState;
  setState: (state: IProfilePageState) => void;
}

export const ProfilePageContext = createContext<IProfilePageContext>(null);

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [state, setState] = useState<IProfilePageState>(defaultProfilePageState()),
    [toggled, setToggledTo] = useState<boolean>(false);

  useInitiateStepTrackerConnectionEffect(appState, setToggledTo, dispatch);
  
  useFetchEmailSettingsEffect(status, state, user.profile.uid, setState);

  const handleBack = (): void => {
    setToggledTo(false);

    if(user.profile.tracker.status === StepTrackerConnectionStatus.Disconnected) {
      dispatch(AppAction.ResetStepTrackerConnection);
    } else if (user.profile.tracker.status === StepTrackerConnectionStatus.DisconnectionFailed) {
      location.reload();
    }
  }

  const getContent = (): JSX.Element => {
    if(status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <ProfileHeader profile={user.profile} />
          <PlayerLevelBadge                 
            clickable
            color={user.profile.color}
            experience={user.profile.experience} 
            miniVerbose 
          />
          <FriendCodeSection friendID={user.profile.friendID} />
          <StepTrackerSection toggleModal={setToggledTo} />
          <EmailNotificationSettingsSection />
          <ActionCenterSection />
        </React.Fragment>
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("park", "png")}
          text="Sign in to view your profile!"
        />
      )
    }
  }

  return(
    <ProfilePageContext.Provider value={{ state, setState }}>
      <Page 
        id="profile-page" 
        backgroundGraphic=""
        meta={MetaUtility.getProfilePageMeta()}
      >   
        {getContent()}
        <StepTrackerConnectionModal toggled={toggled} back={handleBack} />
      </Page>
    </ProfilePageContext.Provider>
  )
}