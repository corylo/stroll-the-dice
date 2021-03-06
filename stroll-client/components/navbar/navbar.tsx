import React, { useContext } from "react";

import { Brand } from "../brand/brand";
import { Button } from "../buttons/button";
import { IconButton } from "../buttons/iconButton";
import { ProfileIcon } from "../profileIcon/profileIcon";

import { AppContext } from "../app/contexts/appContext";

import { AnalyticsUtility } from "../../utilities/analyticsUtility";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, toggles, user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const getNavbarItems = (): JSX.Element => {
    if(status === AppStatus.SignedIn && user) {
      if(user.profile.icon !== "") {
        return (
          <Button id="user-menu-button" className="signed-in" handleOnClick={() => dispatch(AppAction.ToggleMenu, !toggles.menu)}>
            <ProfileIcon color={user.profile.color} icon={user.profile.icon} />
          </Button>          
        );
      }
    } else if (status === AppStatus.SignedOut) {
      const handleSignInClick = (): void => {
        dispatch(AppAction.ToggleSignIn, true);

        AnalyticsUtility.log("navbar_sign_in_click");
      }

      return (
        <IconButton 
          id="sign-in-button" 
          className="fancy-button"
          icon="fad fa-sign-in"          
          handleOnClick={handleSignInClick} 
        />        
      )
    }
  }

  return (
    <div id="navbar">      
      <div id="navbar-content">
        <Brand />
        <div id="navbar-items">  
          {getNavbarItems()}
        </div>
      </div>
    </div>
  )
}