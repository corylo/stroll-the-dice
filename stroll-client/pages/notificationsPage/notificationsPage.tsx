import React from "react";

import { EmptyMessage } from "../../components/emptyMessage/emptyMessage";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";

interface NotificationsPageProps {
  
}

export const NotificationsPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  return(
    <Page 
      id="notifications-page" 
      backgroundGraphic=""
      requireAuth
    >     
      <PageTitle text="Notifications" />
      <EmptyMessage text="You don't have any notifications yet!" />
    </Page>
  )
}