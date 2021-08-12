import React, { useContext } from "react";

import { EmptyMessage } from "../../components/emptyMessage/emptyMessage";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { AppStatus } from "../../enums/appStatus";

interface NotificationsPageProps {
  
}

export const NotificationsPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState } = useContext(AppContext);

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      return (
        <EmptyMessage text="You don't have any notifications yet!" />
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