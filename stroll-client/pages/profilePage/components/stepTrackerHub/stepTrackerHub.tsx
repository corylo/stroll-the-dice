import React, { useContext } from "react";

import { NoTrackerConnectedMessage } from "../../../../components/noTrackerConnectedMessage/noTrackerConnectedMessage";
import { StepTrackerLink } from "./stepTrackerLink";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { StepTrackerUtility } from "../../../../utilities/stepTrackerUtility";

import { StepTracker } from "../../../../../stroll-enums/stepTracker";

interface StepTrackerHubProps {  
  toggleModal: (toggled: boolean) => void;
}

export const StepTrackerHub: React.FC<StepTrackerHubProps> = (props: StepTrackerHubProps) => {     
  const { tracker } = useContext(AppContext).appState.user.profile;

  const getNoTrackerConnectedMessage = (): JSX.Element => {
    if(StepTrackerUtility.showNoTrackerConnectedMessage(tracker.status)) {
      return (
        <NoTrackerConnectedMessage />
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