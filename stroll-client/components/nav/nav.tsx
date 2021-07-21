import React from "react";

import { NavMenuButton } from "./navMenuButton";

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
        <NavMenuButton icon="far fa-user" label="Profile" to="/profile" />
        <NavMenuButton icon="far fa-bell" label="Notifications" to="/notifications" />
        <NavMenuButton icon="far fa-question" label="How To Play" to="/huh" />
      </div>
    )
  }

  const getPhoneNavContent = (): JSX.Element => {
    return (
      <div id="phone-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="far fa-user" label="Profile" to="/profile" />
        <NavMenuButton center icon="far fa-home" label="Home" to="/" />
        <NavMenuButton icon="far fa-bell" label="Notifications" to="/notifications" />
        <NavMenuButton icon="far fa-question" label="How To Play" to="/huh" />
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