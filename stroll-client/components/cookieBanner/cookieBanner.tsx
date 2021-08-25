import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";

import { IconButton } from "../buttons/iconButton";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";
import { CookieStatus } from "../../enums/cookieStatus";
import { TooltipSide } from "../tooltip/tooltip";

interface CookieBannerProps {  
  
}

export const CookieBanner: React.FC<CookieBannerProps> = (props: CookieBannerProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { cookieStatus } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useEffect(() => {
    const cookieStatus = localStorage.getItem("cookie-status");
    
    if(cookieStatus) {
      dispatch(AppAction.SetCookieStatus, cookieStatus);
    } else {
      dispatch(AppAction.SetCookieStatus, CookieStatus.Unknown);
    }
  }, []);

  const handleAccept = (): void => {
    dispatch(AppAction.SetCookieStatus, CookieStatus.Accepted);

    localStorage.setItem("cookie-status", CookieStatus.Accepted);
  }

  const handleDeny = (): void => {
    dispatch(AppAction.SetCookieStatus, CookieStatus.Denied);

    localStorage.setItem("cookie-status", CookieStatus.Denied);
  }

  if(cookieStatus === CookieStatus.Unknown) {
    return ReactDOM.createPortal(
      <div id="cookie-banner-wrapper">
        <div id="cookie-banner">
          <div className="cookie-banner-content">
            <h1 className="cookie-banner-title passion-one-font">We use 🍪</h1>
            <p className="cookie-banner-text passion-one-font">We use cookies in accordance with our <a href="https://legal.strollthedice.com/cookie-policy" target="_blank">Cookie Policy</a>.</p>
          </div>
          <div className="cookie-banner-actions">
            <IconButton 
              icon="fal fa-times" 
              tooltip="Deny"
              tooltipSide={TooltipSide.Left}
              handleOnClick={handleDeny} 
            />
            <IconButton 
              icon="fal fa-check" 
              tooltip="Accept"
              tooltipSide={TooltipSide.Left}
              handleOnClick={handleAccept} 
            />
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
}