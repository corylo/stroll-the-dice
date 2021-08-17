import React, { useContext } from "react";

import { NoTrackerConnectedMessage } from "../../../../components/noTrackerConnectedMessage/noTrackerConnectedMessage";
import { StepTrackerLink } from "./stepTrackerLink";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../../stroll-enums/stepTrackerConnectionStatus";

interface StepTrackerHubProps {  
  toggleModal: (toggled: boolean) => void;
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {     
  const { tracker } = useContext(AppContext).appState.user.profile;

  const getNoTrackerConnectedMessage = (): JSX.Element => {
    if(
      tracker.name === StepTracker.Unknown ||
      tracker.status !== StepTrackerConnectionStatus.Verified
    ) {
      return (
        <NoTrackerConnectedMessage url="/profile" />
      )
    }
  }

  return (
    <div className="step-tracker-hub">
      {getNoTrackerConnectedMessage()}
      <div className="step-tracker-links">
        <StepTrackerLink tracker={StepTracker.GoogleFit} toggleModal={props.toggleModal} />
        <StepTrackerLink tracker={StepTracker.Fitbit} toggleModal={props.toggleModal}  />
      </div>
    </div>
  );
}