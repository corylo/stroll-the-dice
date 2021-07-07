import React, { useContext } from "react";

import { Brand } from "../brand/brand";
import { Button } from "../buttons/button";
import { IconButton } from "../buttons/iconButton";
import { ProfileIcon } from "../profileIcon/profileIcon";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const { status, toggles, user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const getNavbarItems = (): JSX.Element => {
    if(status === AppStatus.SignedIn && user) {
      const getUserMenuButton = (): JSX.Element => {
        if(user.profile.icon !== "") {
          return (
            <Button id="user-menu-button" className="signed-in" handleOnClick={() => dispatch(AppAction.ToggleMenu, !toggles.menu)}>
              <ProfileIcon color={user.profile.color} icon={user.profile.icon} />
            </Button>          
          );
        }
      }

      return (
        <React.Fragment>
          {getUserMenuButton()}
          {/* <IconButton 
            id="user-menu-button"
            icon="far fa-ellipsis-h" 
            handleOnClick={() => dispatch(AppAction.ToggleMenu, !toggles.menu)} 
          /> */}
        </React.Fragment>
      )
    } else if (status === AppStatus.SignedOut) {
      return (
        <IconButton 
          id="sign-in-button" 
          className="fancy-button white"
          icon="fad fa-sign-in"          
          handleOnClick={() => dispatch(AppAction.ToggleSignIn, !toggles.signIn)} 
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