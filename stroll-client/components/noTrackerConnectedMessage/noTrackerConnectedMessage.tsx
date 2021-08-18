import React, { useContext } from "react";

import { IconButton } from "../buttons/iconButton";
import { Label } from "../label/label";

import { AppContext } from "../app/contexts/appContext";

import { StepTrackerConnectionStatus } from "../../../stroll-enums/stepTrackerConnectionStatus";

interface NoTrackerConnectedMessageProps {
  url?: string;
}

export const NoTrackerConnectedMessage: React.FC<NoTrackerConnectedMessageProps> = (props: NoTrackerConnectedMessageProps) => {   
  const { tracker } = useContext(AppContext).appState.user.profile;

  const getLabelText = (): string => {
    if (
      tracker.status === StepTrackerConnectionStatus.Idle ||
      tracker.status === StepTrackerConnectionStatus.ConnectionFailed ||
      tracker.status === StepTrackerConnectionStatus.Disconnected
    ) {
      return "connected";
    } else if(
      tracker.status === StepTrackerConnectionStatus.Connected ||
      tracker.status === StepTrackerConnectionStatus.VerificationFailed
    ) {
      return "verified";
    }
  }

  const getUrlButton = (): JSX.Element => {
    if(props.url) {
      return (
        <div className="game-action-button-wrapper">
          <IconButton
            className="game-action-button"
            icon="fal fa-arrow-right" 
            url={props.url}
          />
        </div>         
      )
    }
  }

  return (
    <div className="no-tracker-connected-message-wrapper">
      <Label
        className="no-tracker-connected-message"
        icon="fal fa-exclamation-triangle"
        text={`Your step tracker isn't ${getLabelText()}`}
      />       
      {getUrlButton()}
    </div>
  )
}