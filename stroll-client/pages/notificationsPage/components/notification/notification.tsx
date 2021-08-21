import React, { useContext, useState } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { IconButton } from "../../../../components/buttons/iconButton";
import { Label } from "../../../../components/label/label";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { NotificationsPageContext } from "../../notificationsPage";

import { NotificationService } from "../../../../services/notificationService";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { INotification } from "../../../../../stroll-models/notification";

import { Icon } from "../../../../../stroll-enums/icon";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface NotificationProps {  
  notification: INotification;
}

export const Notification: React.FC<NotificationProps> = (props: NotificationProps) => {  
  const { profile } = useContext(AppContext).appState.user;

  const { state, setState } = useContext(NotificationsPageContext);

  const { notifications } = state;

  const updateNotifications = (updated: INotification[]): void => {
    setState({ ...state, notifications: updated });
  }

  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Idle);

  const viewNotification = (): void => {
    const updated: INotification[] = notifications.map((notification: INotification) => {
      if(notification.id === props.notification.id) {
        notification.viewedAt = FirestoreDateUtility.dateToTimestamp(new Date());
      }

      return notification;
    });

    updateNotifications(updated);
  }

  const handleOnClick = async (leaving?: boolean): Promise<void> => {
    if(
      props.notification.viewedAt === null &&
      status !== RequestStatus.Loading
    ) {
      try {
        if(leaving) {
          await NotificationService.view(profile.uid, props.notification.id);          
        } else {
          setStatus(RequestStatus.Loading);

          viewNotification();

          await NotificationService.view(profile.uid, props.notification.id);
          
          setStatus(RequestStatus.Success);
        }
      } catch (err) {
        console.error(err);

        setStatus(RequestStatus.Idle);
      }
    }
  }

  const isLink: boolean = props.notification.url !== "";

  const getContent = (): JSX.Element => {
    const getCommonContentItems = (): JSX.Element => {      
      const getText = (): JSX.Element => {
        if(Array.isArray(props.notification.text)) {
          const sentences: JSX.Element[] = props.notification.text.map((sentence: string, index: number) => (
            <p key={index} className="notification-text passion-one-font">{sentence}</p>
          ));

          return (
            <React.Fragment>
              {sentences}
            </React.Fragment>
          );
        }

        return (
          <p className="notification-text passion-one-font">{props.notification.text}</p>
        )
      }

      return (
        <React.Fragment>
          <h1 className="notification-date passion-one-font">{FirestoreDateUtility.timestampToDate(props.notification.createdAt).toLocaleTimeString()}</h1> 
          <h1 className="notification-title passion-one-font">{props.notification.title}</h1>  
          {getText()}
        </React.Fragment>
      )
    }

    if(isLink) {
      return ( 
        <Link 
          to={props.notification.url} 
          className="notification-content link"
          onClick={() => handleOnClick(true)}
        >
          <div className="notification-content-items">
            {getCommonContentItems()}
            <Label
              className="notification-url"
              icon="fal fa-link"
              text={props.notification.url}
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
    read: props.notification.viewedAt !== null, 
    unread: props.notification.viewedAt === null 
  });

  return (
    <div className={classes}>
      {getContent()}
      <IconButton
        className="notification-status-icon"
        disabled={props.notification.viewedAt !== null}
        icon={props.notification.viewedAt === null ? Icon.NotificationUnread : Icon.NotificationRead}
        tooltip="Mark as read"
        tooltipSide={TooltipSide.Left}
        handleOnClick={() => handleOnClick(false)}
      />
    </div>
  )   
}