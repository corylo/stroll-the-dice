import React from "react";

import { NavMenuButton } from "./navMenuButton";
import { NotificationNavButton } from "./notificationNavButton";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const getGamesPageLink = (): JSX.Element => {
    return (     
      <NavMenuButton icon="far fa-dice" label="Games" to="/games" />
    )
  }

  const getMonitorNavContent = (): JSX.Element => {
    return (
      <div id="monitor-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="far fa-home" label="Home" to="/" />
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="far fa-store" label="Shop" to="/shop" />
        <NotificationNavButton />
        <NavMenuButton icon="far fa-question" label="How To Play" to="/how-to-play" />
      </div>
    )
  }

  const getPhoneNavContent = (): JSX.Element => {
    return (
      <div id="phone-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="far fa-store" label="Shop" to="/shop" />
        <NavMenuButton center icon="far fa-home" label="Home" to="/" />
        <NotificationNavButton />
        <NavMenuButton icon="far fa-question" label="How To Play" to="/how-to-play" />
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