import React, { useContext } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { auth } from "../../firebase";

import { Button } from "../buttons/button";
import { ProfileIcon } from "../profileIcon/profileIcon";

import { AppContext } from "../app/contexts/appContext";

import { useOnClickAwayEffect } from "../../effects/appEffects";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";

interface UserMenuModalProps {
  
}

export const UserMenuModal: React.FC<UserMenuModalProps> = (props: UserMenuModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const { toggles, user } = appState;
  
  useOnClickAwayEffect(
    toggles.menu, 
    ["user-menu", "user-menu-button"], 
    [toggles.menu], 
    () => dispatch(AppAction.ToggleMenu, false)
  );

  if(toggles.menu) {
    const handleSignOut = async () => {
      try {
        dispatch(AppAction.InitiateSignOut);
        
        await auth.signOut();
        
        location.reload();
      } catch (err) {
        console.error(err);
      }
    }

    const getUserIcon = (): JSX.Element => {
      if(user) {
        return (
          <ProfileIcon color={user.profile.color} icon={user.profile.icon} />
        )
      }
    }

    const getUserInfo = (): JSX.Element => {
      if(user) {
        return (
          <React.Fragment>       
            <h1 className="profile-username passion-one-font" style={{ color: `rgb(${user.profile.color})` }}>{user.profile.username}</h1>     
            <h1 className="profile-email passion-one-font">{user.email}</h1>
          </React.Fragment>
        )
      }
    }

    const getProfileButton = (): JSX.Element => {
      if(user) {
        return (          
          <Button className="user-menu-item passion-one-font" url="/profile" handleOnClick={() => dispatch(AppAction.ToggleMenu, false)}>
            Profile
          </Button>
        )
      }
    }

    const getSignOutButton = (): JSX.Element => {
      if(user) {
        return (          
          <Button id="sign-out-button" className="user-menu-item passion-one-font fancy-button" handleOnClick={handleSignOut}>
            Sign Out
          </Button>
        )
      }
    }

    const getClasses = (): string => {
      return classNames(
        "scroll-bar", { 
        "signed-in": appState.status === AppStatus.SignedIn, 
        "signed-out": appState.status === AppStatus.SignedOut 
      });
    }

    return ReactDOM.createPortal(
      <div id="user-menu" className={getClasses()}>
        {getUserIcon()}
        <div id="user-menu-content">
          {getUserInfo()}
          {getProfileButton()}
          {/* <Button className="user-menu-item passion-one-font" url="https://legal.strollthedice.com" external>
            Legal
          </Button> */}
          {getSignOutButton()}
        </div>
      </div>,
      document.getElementById("navbar-items")
    )
  }

  return null;
}