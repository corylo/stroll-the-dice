import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, toggles, user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  if(status === AppStatus.SignedIn) {
    return (
      <div id="nav-menu-wrapper">    
        <div id="nav-menu">
          <div id="nav-menu-content">
            <NavLink to="/" className="nav-menu-button" exact>
              <i className="far fa-home" />
              <h1 className="passion-one-font">Home</h1>
            </NavLink>
            <NavLink to="/profile" className="nav-menu-button" exact>
              <i className="fal fa-user" />
              <h1 className="passion-one-font">Profile</h1>
            </NavLink>
            <NavLink to="/games" className="nav-menu-button" exact>
              <i className="fal fa-dice" />
              <h1 className="passion-one-font">My Games</h1>
            </NavLink>
            <NavLink to="/create" className="nav-menu-button" exact>
              <i className="fal fa-plus" />
              <h1 className="passion-one-font">Create Game</h1>
            </NavLink>
          </div>
        </div>
      </div>
    )
  }

  return null;
}