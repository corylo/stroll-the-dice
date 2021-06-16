import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AppContext } from "../app/contexts/appContext";

import { AppStatus } from "../../enums/appStatus";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  const { appState } = useContext(AppContext);

  const { status } = appState;

  const getAuthenticatedLinks = (): JSX.Element => {
    if(status === AppStatus.SignedIn) {
      return (
        <React.Fragment>
          <NavLink to="/create" className="nav-menu-button" exact>
            <i className="fal fa-plus" />
            <h1 className="passion-one-font">Create Game</h1>
          </NavLink>
          <NavLink to="/games" className="nav-menu-button" exact>
            <i className="fal fa-dice" />
            <h1 className="passion-one-font">My Games</h1>
          </NavLink>
          <NavLink to="/profile" className="nav-menu-button" exact>
            <i className="fal fa-user" />
            <h1 className="passion-one-font">Profile</h1>
          </NavLink>
          <NavLink to="/notifications" className="nav-menu-button" exact>
            <i className="fal fa-bell" />
            <h1 className="passion-one-font">Notifications</h1>
          </NavLink>
        </React.Fragment>
      )
    }
  }

  return (
    <div id="nav-menu-wrapper">    
      <div id="nav-menu">
        <div id="nav-menu-content">
          <NavLink to="/" className="nav-menu-button" exact>
            <i className="far fa-home" />
            <h1 className="passion-one-font">Home</h1>
          </NavLink>
          {getAuthenticatedLinks()}
        </div>
      </div>
    </div>
  )
}