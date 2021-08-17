import React, { useContext } from "react";

import { Button } from "../../../../components/buttons/button";
import { IconButton } from "../../../../components/buttons/iconButton";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { AppAction } from "../../../../enums/appAction";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../../stroll-enums/stepTrackerConnectionStatus";
import { StrollTheDiceCDN } from "../../../../../stroll-enums/strollTheDiceCDN";

interface StepTrackerLinkProps {  
  tracker: StepTracker;
  toggleModal: (toggled: boolean) => void;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const hasTracker: boolean = user.profile.tracker.name !== StepTracker.Unknown,
    logo: string = `${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(props.tracker)}`;
 
  const getConnectionIcon = (): JSX.Element => {
    if(hasTracker && user.profile.tracker.name !== props.tracker) {
      return null;
    } else if(
      user.profile.tracker.status === StepTrackerConnectionStatus.Idle ||
      user.profile.tracker.status === StepTrackerConnectionStatus.Connected
    ) {
      const label: string = user.profile.tracker.status === StepTrackerConnectionStatus.Idle
        ? "Connect"
        : "Verify";

      return (
        <div className="step-tracker-link-connection-icon">
          <i className="fal fa-plus" />
          <h1 className="passion-one-font">{label}</h1>
        </div>
      )
    } else if(
      user.profile.tracker.status === StepTrackerConnectionStatus.Connecting || 
      user.profile.tracker.status === StepTrackerConnectionStatus.Verifying
    ) {
      return (
        <div className="step-tracker-link-connection-icon">
          <i className="connecting-icon fal fa-spinner-third" />
        </div>
      )
    } else if (
      user.profile.tracker.status === StepTrackerConnectionStatus.ConnectionFailed ||
      user.profile.tracker.status === StepTrackerConnectionStatus.VerificationFailed
    ) {
      const handleOnClick = (): void => {
        if(user.profile.tracker.status === StepTrackerConnectionStatus.ConnectionFailed) {
          dispatch(AppAction.ResetStepTrackerConnection);
        } else {
          props.toggleModal(true);
        }
      }

      const label: string = user.profile.tracker.status === StepTrackerConnectionStatus.ConnectionFailed
        ? "Not Connected"
        : "Not Verified";

      return (
        <div className="step-tracker-link-connection-icon">          
          <h1 className="connected-label passion-one-font">{label}</h1>
          <div className="step-tracker-buttons">
            <IconButton 
              className="reset-step-tracker-button" 
              icon="fal fa-redo"               
              tooltip="Try Again"
              tooltipSide={TooltipSide.Left}
              handleOnClick={handleOnClick} 
            />
          </div>
        </div>
      )
    } else if (user.profile.tracker.status === StepTrackerConnectionStatus.Verified) {
      return (
        <div className="step-tracker-link-connection-icon">          
          <h1 className="connected-label passion-one-font">Connected</h1>
          <div className="step-tracker-buttons">
            <IconButton 
              className="disconnect-step-tracker-button" 
              icon="fal fa-times"               
              tooltip="Disconnect"
              tooltipSide={TooltipSide.Left}
              handleOnClick={() => props.toggleModal(true)} 
            />
          </div>
        </div>
      )
    }
  }
  
  if(hasTracker && props.tracker === user.profile.tracker.name) {
    return (
      <div className="step-tracker-link">
        <div className="step-tracker-link-branding">
          <img src={logo} />      
          <h1 className="passion-one-font">{props.tracker}</h1>
        </div>
        {getConnectionIcon()}
      </div>
    )
  }
  
  return (
    <Button 
      className="step-tracker-link" 
      disabled={hasTracker && props.tracker !== user.profile.tracker.name}
      url={StepTrackerUtility.getOAuthUrl(props.tracker)} 
      external
    >
      <div className="step-tracker-link-branding">
        <img src={logo} />      
        <h1 className="passion-one-font">{props.tracker}</h1>
      </div>
      {getConnectionIcon()}
    </Button>
  );
}