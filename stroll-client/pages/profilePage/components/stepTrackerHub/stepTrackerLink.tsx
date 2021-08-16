import React, { useContext, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { IconButton } from "../../../../components/buttons/iconButton";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { StepTrackerService } from "../../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { AppAction } from "../../../../enums/appAction";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StrollTheDiceCDN } from "../../../../../stroll-enums/strollTheDiceCDN";

interface StepTrackerLinkProps {  
  tracker: StepTracker;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, user } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [confirm, setConfirm] = useState<boolean>(false);

  const hasTracker: boolean = user.profile.tracker !== "",
    logo: string = `${StrollTheDiceCDN.Url}/img/brands/${StepTrackerUtility.getLogo(props.tracker)}`;
 
  const getStatus = (tracker: StepTracker): RequestStatus => {
    if(user.profile.tracker === tracker) {
      if(statuses.tracker.is === RequestStatus.Idle || statuses.tracker.is === RequestStatus.Success) {
        return RequestStatus.Success;
      }

      return statuses.tracker.is;
    }

    return RequestStatus.Idle;
  }

  const status: RequestStatus = getStatus(props.tracker);

  const getConnectionIcon = (): JSX.Element => {
    if(status === RequestStatus.Idle) {
      return (
        <div className="step-tracker-link-connection-icon">
          <i className="fal fa-plus" />
          <h1 className="passion-one-font">Connect</h1>
        </div>
      )
    } else if(status === RequestStatus.Loading) {
      return (
        <div className="step-tracker-link-connection-icon">
          <i className="connecting-icon fal fa-spinner-third" />
        </div>
      )
    } else if (status === RequestStatus.Error) {
      return (
        <div className="step-tracker-link-connection-icon">          
          <h1 className="connected-label passion-one-font">Error</h1>
          <div className="step-tracker-buttons">
            <IconButton 
              className="reset-step-tracker-button" 
              icon="fal fa-redo"               
              tooltip="Try Again"
              tooltipSide={TooltipSide.Left}
              handleOnClick={() => dispatch(AppAction.ResetStepTrackerConnection)} 
            />
          </div>
        </div>
      )
    } else if (status === RequestStatus.Success) {
      const handleDisconnect = async (): Promise<void> => {
        try {
          setConfirm(false);

          dispatch(AppAction.InitiateStepTrackerDisconnection);

          await StepTrackerService.disconnect();

          dispatch(AppAction.CompleteStepTrackerDisconnection);
        } catch (err) {
          console.error(err);
        }
      }

      const getButtons = (): JSX.Element => {
        if(confirm) {
          return (
            <div className="step-tracker-buttons">
              <IconButton 
                className="confirm-disconnect-step-tracker-button" 
                icon="fal fa-check" 
                tooltip="Confirm"
                tooltipSide={TooltipSide.Left}
                handleOnClick={handleDisconnect} 
              />
              <IconButton 
                className="cancel-disconnect-step-tracker-button" 
                icon="fal fa-times" 
                tooltip="Cancel"
                tooltipSide={TooltipSide.Left}
                handleOnClick={() => setConfirm(false)} 
              />
            </div>
          )
        }

        return (
          <div className="step-tracker-buttons">
            <IconButton 
              className="disconnect-step-tracker-button" 
              icon="fal fa-times"               
              tooltip="Disconnect"
              tooltipSide={TooltipSide.Left}
              handleOnClick={() => setConfirm(true)} 
            />
          </div>
        )
      }

      return (
        <div className="step-tracker-link-connection-icon">          
          <h1 className="connected-label passion-one-font">Connected</h1>
          {getButtons()}
        </div>
      )
    }
  }

  if(hasTracker && props.tracker === user.profile.tracker) {
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
      disabled={hasTracker && props.tracker !== user.profile.tracker}
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