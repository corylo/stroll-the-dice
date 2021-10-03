import React from "react";

import { NavMenuButton } from "./navMenuButton";
import { NotificationNavButton } from "./notificationNavButton";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const getMonitorNavContent = (): JSX.Element => {
    return (
      <div id="monitor-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="far fa-home" label="Home" to="/" />
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="fal fa-chart-bar" label="Stats" to="/profile/stats" />
        <NavMenuButton icon="far fa-user" label="Profile" to="/profile" />
        <NotificationNavButton />
      </div>
    )
  }

  const getPhoneNavContent = (): JSX.Element => {
    return (
      <div id="phone-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="far fa-user" label="Profile" to="/profile" />
        <NavMenuButton center icon="far fa-home" label="Home" to="/" />
        <NavMenuButton icon="fal fa-chart-bar" label="Stats" to="/profile/stats" />
        <NotificationNavButton />
      </div>
    )
  }

  return (
    <div id="nav-menu-wrapper">    
      <div id="nav-menu">
        {getMonitorNavContent()}
        {getPhoneNavContent()}
      </div>        
    </div>
  )
}