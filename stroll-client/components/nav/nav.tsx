import React from "react";
import { NavLink } from "react-router-dom";

interface NavProps {}

export const Nav: React.FC<NavProps> = (props: NavProps) => {
  return (
    <div id="nav-menu-wrapper">    
      <div id="nav-menu">
        <div id="nav-menu-content">
          <NavLink to="/" className="nav-menu-button" exact>
            <i className="far fa-home" />
            <h1 className="passion-one-font">Home</h1>
          </NavLink>
          <NavLink to="/create" className="nav-menu-button" exact>
            <i className="fal fa-plus" />
            <h1 className="passion-one-font">Create Game</h1>
          </NavLink>
          {/* <NavLink to="/games" className="nav-menu-button" exact>
            <i className="fal fa-dice" />
            <h1 className="passion-one-font">Games</h1>
          </NavLink> */}
          <NavLink to="/profile" className="nav-menu-button" exact>
            <i className="fal fa-user" />
            <h1 className="passion-one-font">Profile</h1>
          </NavLink>
          <NavLink to="/notifications" className="nav-menu-button" exact>
            <i className="fal fa-bell" />
            <h1 className="passion-one-font">Notifications</h1>
          </NavLink>
          <NavLink to="/huh?" className="nav-menu-button" exact>
            <i className="fal fa-question" />
            <h1 className="passion-one-font">How To Play</h1>
          </NavLink>
        </div>
      </div>
    </div>
  )
}