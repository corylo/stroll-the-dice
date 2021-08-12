import React from "react";

import { Label } from "../../../../components/label/label";
import { Notification } from "../notification/notification";

import { INotification } from "../../../../../stroll-models/notification";

interface NotificationTimelineGroupProps {  
  date: string;
  notifications: INotification[];
}

export const NotificationTimelineGroup: React.FC<NotificationTimelineGroupProps> = (props: NotificationTimelineGroupProps) => {      
  const getNotifications = (): JSX.Element[] => {
    return props.notifications.map((notification: INotification) => (
      <Notification key={notification.id} notification={notification} />
    ));
  }

  return (
    <div className="notification-timeline-group">
      <Label
        className="notification-timeline-group-date"
        icon="fal fa-clock"
        text={props.date}
      />
      <div className="notification-timeline-group-list">
        {getNotifications()}
      </div>
    </div>
  )
}