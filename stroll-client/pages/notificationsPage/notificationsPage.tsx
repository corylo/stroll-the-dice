import React, { createContext, useContext, useState } from "react";

import { NotificationTimeline } from "./components/notificationTimeline/notificationTimeline";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchNotificationsEffect } from "./effects/notificationsPageEffects";

import { ImageUtility } from "../../utilities/imageUtility";
import { MetaUtility } from "../../utilities/metaUtility";

import { defaultNotificationsPageState, INotificationsPageState } from "./models/notificationsPageState";

import { AppStatus } from "../../enums/appStatus";

interface INotificationsPageContext {
  state: INotificationsPageState;
  setState: (state: INotificationsPageState) => void;
}

export const NotificationsPageContext = createContext<INotificationsPageContext>(null);

interface NotificationsPageProps {
  
}

export const NotificationsPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState } = useContext(AppContext);

  const { profile } = appState.user;

  const [state, setState] = useState<INotificationsPageState>(defaultNotificationsPageState());

  useFetchNotificationsEffect(profile.uid, state, setState);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <NotificationTimeline />
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("park", "png")}
          text="Sign in to view your notifications!"
        />
      )
    }
  }

  const getTitle = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <PageTitle text="Notifications" />
      )
    }
  }

  return(
    <NotificationsPageContext.Provider value={{ state, setState }}>
      <Page id="notifications-page" backgroundGraphic="" meta={MetaUtility.getNotificationsPageMeta()}>     
        {getTitle()}
        {getContent()}
      </Page>
    </NotificationsPageContext.Provider>
  )
}