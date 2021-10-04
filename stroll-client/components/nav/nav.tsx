import React, { useContext } from "react";

import { NavMenuButton } from "./navMenuButton";
import { NotificationNavButton } from "./notificationNavButton";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const toggleHowToPlay = (): void => dispatch(AppAction.ToggleHowToPlay, true);

  const getMonitorNavContent = (): JSX.Element => {
    return (
      <div id="monitor-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="far fa-home" label="Home" to="/" />
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="fal fa-chart-bar" label="Stats" to="/profile/stats" />
        <NotificationNavButton />
        <NavMenuButton icon="far fa-question" label="How To Play" handleOnClick={toggleHowToPlay} />
      </div>
    )
  }

  const getPhoneNavContent = (): JSX.Element => {
    return (
      <div id="phone-nav-menu-content" className="nav-menu-content">
        <NavMenuButton icon="fal fa-plus" label="Create Game" to="/create" />
        <NavMenuButton icon="fal fa-chart-bar" label="Stats" to="/profile/stats" />
        <NavMenuButton center icon="far fa-home" label="Home" to="/" />
        <NotificationNavButton />
        <NavMenuButton icon="far fa-question" label="How To Play" handleOnClick={toggleHowToPlay} />
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