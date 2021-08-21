import React, { useContext } from "react";
import _groupBy from "lodash.groupby";

import { Button } from "../../../../components/buttons/button";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { LoadingIcon } from "../../../../components/loadingIcon/loadingIcon";
import { NotificationTimelineGroup } from "./notificationTimelineGroup";

import { NotificationsPageContext } from "../../notificationsPage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { INotification } from "../../../../../stroll-models/notification";
import { INotificationTimelineGroup } from "../../models/notificationTimelineGroup";

import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface NotificationTimelineProps {  
  
}

export const NotificationTimeline: React.FC<NotificationTimelineProps> = (props: NotificationTimelineProps) => {  
  const { state, setState } = useContext(NotificationsPageContext);

  const { notifications, statuses } = state;

  const getLoadingIcon = (): JSX.Element => {
    if(statuses.more === RequestStatus.Loading) {
      return (
        <div className="loading-more-notifications-wrapper">
          <LoadingIcon />
        </div>
      )
    } 
  }

  const getViewMoreButton = (): JSX.Element => {
    if(
      state.statuses.more !== RequestStatus.Loading && 
      state.notifications.length !== 0 &&
      !state.end
    ) {
      return (        
        <Button 
          className="view-more-button passion-one-font" 
          handleOnClick={() => setState({ ...state, index: state.index + 1 })}
        >
          View more
        </Button>
      )
    }
  }

  if(notifications.length > 0) {
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
        {getViewMoreButton()}
      </div>
    );
  } else if (
    statuses.initial === RequestStatus.Success &&
    notifications.length === 0
  ) {
    return (    
      <EmptyMessage text="You don't have any notifications yet!" />
    )
  }

  return null;
}