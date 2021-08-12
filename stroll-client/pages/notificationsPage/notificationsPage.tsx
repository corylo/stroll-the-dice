import React, { useContext } from "react";

import { NotificationTimeline } from "./components/notificationTimeline/notificationTimeline";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { useGetNotificationsEffect } from "./effects/notificationsPageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";

interface NotificationsPageProps {
  
}

export const NotificationsPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useGetNotificationsEffect(appState, 10, dispatch);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <NotificationTimeline />
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("cyclist", "png")}
          text="Sign in to view your notifications!"
        />
      )
    }
  }

  return(
    <Page 
      id="notifications-page" backgroundGraphic="">     
      <PageTitle text="Notifications" />
      {getContent()}
    </Page>
  )
}