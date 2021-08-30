import React, { useContext, useState } from "react";

import { ActionCenterSection } from "./components/actionCenterSection/actionCenterSection";
import { FriendCodeSection } from "./components/friendCodeSection/friendCodeSection";
import { GameDaysSection } from "./components/gameDaysSection/gameDaysSection";
import { GameStatsSection } from "./components/gameStatsSection/gameStatsSection";
import { Page } from "../../components/page/page";
import { ProfileHeader } from "../../components/profileHeader/profileHeader";
import { StepTrackerConnectionModal } from "./components/stepTrackerConnectionModal/stepTrackerConnectionModal";
import { StepTrackerSection } from "./components/stepTrackerSection/stepTrackerSection";

import { AppContext } from "../../components/app/contexts/appContext";

import { useInitiateStepTrackerConnectionEffect } from "./effects/profilePageEffects";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { StepTrackerConnectionStatus } from "../../../stroll-enums/stepTrackerConnectionStatus";

interface ProfilePageProps {
  
}

export const ProfilePage: React.FC<ProfilePageProps> = (props: ProfilePageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [toggled, setToggled] = useState<boolean>(false);

  useInitiateStepTrackerConnectionEffect(appState, setToggled, dispatch);

  const handleBack = (): void => {
    setToggled(false);

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
          <FriendCodeSection friendID={user.profile.friendID} />
          <GameStatsSection uid={user.profile.uid} />
          <StepTrackerSection toggleModal={setToggled} />
          <GameDaysSection available={user.stats.gameDays.available} />
          <ActionCenterSection />
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
      <StepTrackerConnectionModal toggled={toggled} back={handleBack} />
    </Page>
  )
}