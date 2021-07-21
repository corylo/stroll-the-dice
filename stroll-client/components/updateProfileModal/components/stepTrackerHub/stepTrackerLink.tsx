import React, { useContext } from "react";

import { Button } from "../../../buttons/button";
import { IconButton } from "../../../buttons/iconButton";

import { AppContext } from "../../../app/contexts/appContext";

import { StepTrackerService } from "../../../../services/stepTrackerService";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { AppAction } from "../../../../enums/appAction";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerLinkProps {    
  img: string;
  status: RequestStatus;
  tracker: StepTracker;
  url: string;
}

export const StepTrackerLink: React.FC<StepTrackerLinkProps> = (props: StepTrackerLinkProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

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
          dispatch(AppAction.InitiateStepTrackerDisconnection);

          await StepTrackerService.disconnect();

          dispatch(AppAction.CompleteStepTrackerDisconnection);
        } catch (err) {
          console.error(err);
        }
      }

      return (
        <React.Fragment>
          <h1 className="passion-one-font">{props.tracker}<span className="highlight-main">Connected</span></h1>
          <IconButton className="disconnect-step-tracker-button" icon="fal fa-times" handleOnClick={handleDisconnect} />
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