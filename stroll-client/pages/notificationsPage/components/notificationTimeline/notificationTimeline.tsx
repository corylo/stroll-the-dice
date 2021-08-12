import React, { useContext } from "react";
import _groupBy from "lodash.groupby";

import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { NotificationTimelineGroup } from "./notificationTimelineGroup";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { INotification } from "../../../../../stroll-models/notification";
import { INotificationTimelineGroup } from "../../models/notificationTimelineGroup";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface NotificationTimelineProps {  
  
}

export const NotificationTimeline: React.FC<NotificationTimelineProps> = (props: NotificationTimelineProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { notifications, statuses } = appState;

  const getLoadingIcon = (): JSX.Element => {
    if(statuses.notifications.is === RequestStatus.Loading) {
      return (
        <div className="loading-more-notifications-wrapper">
          <LoadingIcon />
        </div>
      )
    } 
  }

  if(appState.notifications.length > 0) {
    const getNotificationGroups = (): JSX.Element[] => {
      return Object.entries(_groupBy(notifications, (notification: INotification) => FirestoreDateUtility.timestampToLocaleDate(notification.createdAt)))
        .map((entry: any) => ({ date: entry[0], notifications: entry[1] }))
        .map((group: INotificationTimelineGroup) => {
          return (
            <NotificationTimelineGroup 
              key={group.date} 
              date={group.date}
              notifications={group.notifications}
            />
          )
        });
    }

    return (
      <div id="notification-timeline">
        {getNotificationGroups()}
        {getLoadingIcon()}
      </div>
    );
  } else if (
    statuses.notifications.is === RequestStatus.Success &&
    appState.notifications.length === 0
  ) {
    return (    
      <EmptyMessage text="You don't have any notifications yet!" />
    )
  }

  return null;
}