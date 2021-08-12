import React, { useContext, useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { IconButton } from "../../../../components/buttons/iconButton";
import { Label } from "../../../../components/label/label";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { NotificationService } from "../../../../services/notificationService";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { INotification } from "../../../../../stroll-models/notification";

import { AppAction } from "../../../../enums/appAction";
import { Icon } from "../../../../../stroll-enums/icon";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface NotificationProps {  
  notification: INotification;
}

export const Notification: React.FC<NotificationProps> = (props: NotificationProps) => {      
  const { appState, dispatchToApp } = useContext(AppContext);

  const { notification } = props;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Idle);

  const viewNotification = (): void => {
    const updatedNotifications: INotification[] = appState.notifications.map((n: INotification) => {
      if(n.id === notification.id) {
        n.viewedAt = FirestoreDateUtility.dateToTimestamp(new Date());
      }

      return n;
    })

    dispatch(AppAction.SetNotifications, updatedNotifications);

  }

  const handleOnClick = async (): Promise<void> => {
    if(
      notification.viewedAt === null &&
      status !== RequestStatus.Loading
    ) {
      try {
        setStatus(RequestStatus.Loading);

        viewNotification();

        await NotificationService.view(appState.user.profile.uid, notification.id);
        
        setStatus(RequestStatus.Success);
      } catch (err) {
        console.error(err);

        setStatus(RequestStatus.Idle);
      }
    }
  }

  const isLink: boolean = notification.url !== "";

  const getContent = (): JSX.Element => {
    const getCommonContentItems = (): JSX.Element => {      
      return (
        <React.Fragment>
          <h1 className="notification-date passion-one-font">{FirestoreDateUtility.timestampToDate(notification.createdAt).toLocaleTimeString()}</h1> 
          <h1 className="notification-title passion-one-font">{notification.title}</h1>  
          <p className="notification-text passion-one-font">{notification.text}</p>  
        </React.Fragment>
      )
    }

    if(isLink) {
      return ( 
        <Link 
          to={notification.url} 
          className="notification-content link"
        >
          <div className="notification-content-items">
            {getCommonContentItems()}
            <Label
              className="notification-url"
              icon="fal fa-link"
              text={notification.url}
            />
          </div>
        </Link>
      )
    }

    return (
      <div className="notification-content">
        <div className="notification-content-items">
          {getCommonContentItems()}
        </div>
      </div>
    )
  }

  const classes: string = classNames(
    "notification", { 
    link: isLink,
    read: notification.viewedAt !== null, 
    unread: notification.viewedAt === null 
  });

  return (
    <div className={classes}>
      {getContent()}
      <IconButton
        className="notification-status-icon"
        disabled={notification.viewedAt !== null}
        icon={notification.viewedAt === null ? Icon.NotificationUnread : Icon.NotificationRead}
        handleOnClick={handleOnClick}
      />
    </div>
  )   
}