import React from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { IconButton } from "../../../../components/buttons/iconButton";
import { Label } from "../../../../components/label/label";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { INotification } from "../../../../../stroll-models/notification";

import { Icon } from "../../../../../stroll-enums/icon";

interface NotificationProps {  
  notification: INotification;
}

export const Notification: React.FC<NotificationProps> = (props: NotificationProps) => {      
  const { notification } = props;

  const handleOnClick = (): void => {

  }

  const isLink: boolean = notification.url !== "";

  const classes: string = classNames(
    "notification", { 
    link: isLink,
    read: notification.viewedAt !== null, 
    unread: notification.viewedAt === null 
  });

  const getContent = (): JSX.Element => {
    const getUrl = (): JSX.Element => {
      if(isLink) {
        return (
          <Label
            className="notification-url"
            icon="fal fa-link"
            text={notification.url}
          />
        )
      }
    }

    return (
      <React.Fragment>
        <div className="notification-content">
          <h1 className="notification-date passion-one-font">{FirestoreDateUtility.timestampToDate(notification.createdAt).toLocaleTimeString()}</h1> 
          <h1 className="notification-title passion-one-font">{notification.title}</h1>  
          <p className="notification-text passion-one-font">{notification.text}</p>  
          {getUrl()}
        </div>
        <IconButton
          className="notification-status-icon"
          icon={notification.viewedAt === null ? Icon.NotificationUnread : Icon.NotificationRead}
          handleOnClick={handleOnClick}
        />
      </React.Fragment>
    )
  }

  if(isLink) {   
    return (
      <Link 
        to={notification.url} 
        className={classes}
      >
        {getContent()}
      </Link>
    )   
  }  

  return (
    <div className={classes}>
      {getContent()}
    </div>
  )   
}