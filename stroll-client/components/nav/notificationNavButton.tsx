import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AppContext } from "../app/contexts/appContext";

interface NotificationNavButtonProps {
  
}

export const NotificationNavButton: React.FC<NotificationNavButtonProps> = (props: NotificationNavButtonProps) => {  
  const { appState } = useContext(AppContext);

  const { stats } = appState.user;

  const getNotificationCount = (): JSX.Element => {
    if(stats.notifications.unviewed > 0) {
      const getText = (): string | number => {
        if(stats.notifications.unviewed > 8) {
          return "9+";
        }

        return stats.notifications.unviewed;
      }

      return (
        <h1 className="notification-count passion-one-font">{getText()}</h1>
      )
    }
  }

  return (
    <div className="notification-nav-menu-button-wrapper nav-menu-button-wrapper">
      <NavLink to="/notifications" className="nav-menu-button" exact>
        <i className="far fa-bell" />
        <h1 className="notification-label passion-one-font">Notifications</h1>
        {getNotificationCount()}
      </NavLink>
    </div>
  );
}