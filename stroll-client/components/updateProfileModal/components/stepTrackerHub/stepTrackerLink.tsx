import React, { useContext, useState } from "react";

import { Button } from "../../../buttons/button";
import { IconButton } from "../../../buttons/iconButton";

import { AppContext } from "../../../app/contexts/appContext";

import { StepTrackerService } from "../../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { AppAction } from "../../../../enums/appAction";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { TooltipSide } from "../../../tooltip/tooltip";

interface StepTrackerLinkProps {    
  img: string;
  status: RequestStatus;
  tracker: StepTracker;
  url: string;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [confirm, setConfirm] = useState<boolean>(false);

  if(props.status === RequestStatus.Idle) {    
    return (
      <Button className="step-tracker-link" url={StepTrackerUtility.getOAuthUrl(props.tracker)} external>
        <img src={props.img} />      
        <h1 className="passion-one-font">{props.tracker}</h1>
      </Button>
    );
  }

  const getConnectedStepTrackerLinkContent = (): JSX.Element => {
    if(props.status === RequestStatus.Loading) {
      return (
        <React.Fragment>
          <h1 className="passion-one-font">{props.tracker}</h1>
          <i className="connecting-icon fal fa-spinner-third" />
        </React.Fragment>
      )
    } else if (props.status === RequestStatus.Success) {
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
            <div className="step-tracker-disconnection-buttons">
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
          <div className="step-tracker-disconnection-buttons">
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
        <React.Fragment>
          <h1 className="passion-one-font">{props.tracker}<span className="highlight-main">Connected</span></h1>
          {getButtons()}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <h1 className="passion-one-font">{props.tracker}<span className="highlight-error">Error Connecting</span></h1>
      </React.Fragment>
    )
  }

  return (
    <div className="connected-step-tracker-link">
      <img src={props.img} />      
      {getConnectedStepTrackerLinkContent()}
    </div>
  )
}