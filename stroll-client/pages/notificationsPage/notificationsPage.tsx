import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";

import { Graphic } from "../../../stroll-enums/graphic";

interface NotificationsPageProps {
  
}

export const NotificationsPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState } = useContext(AppContext);

  return(
    <Page 
      id="my-games-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.DayAtPark)} 
      requireAuth
    >     
      <PageTitle text="Notifications" />
    </Page>
  )
}