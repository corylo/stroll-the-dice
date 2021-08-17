import React, { useContext } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { AnimatedCounter } from "../../../../components/animatedCounter/animatedCounter";
import { NoTrackerConnectedMessage } from "../../../../components/noTrackerConnectedMessage/noTrackerConnectedMessage";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { Icon } from "../../../../../stroll-enums/icon";
import { PlayerStatus } from "../../../../../stroll-enums/playerStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../../stroll-enums/stepTrackerConnectionStatus";

interface MyPointsProps {  
  
}

export const MyPoints: React.FC<MyPointsProps> = (props: MyPointsProps) => {   
  const { tracker } = useContext(AppContext).appState.user.profile,
    { player, statuses } = useContext(GamePageContext).state;

  if(statuses.player === PlayerStatus.Playing) {
    const { points } = player;

    const getNoTrackerConnectedMessage = (): JSX.Element => {
      if(
        tracker.name === StepTracker.Unknown ||
        tracker.status !== StepTrackerConnectionStatus.Verified
      ) {
        return (
          <div className="no-tracker-connected-message-outer-wrapper">
            <NoTrackerConnectedMessage url="/profile" />
          </div>
        )
      }
    }
  
    return ReactDOM.createPortal(
      <div className="my-points-modal">
        <div className="my-points-wrapper">
          {getNoTrackerConnectedMessage()}
          <div className="my-points">             
            <div className="my-points-content-wrapper">
              <div className="my-points-content">
                <i className={classNames("my-points-icon", Icon.Points)} />
                <div className="my-available-points-wrapper">
                  <AnimatedCounter 
                    className="my-available-points"
                    initialValue={points.available} 
                    tooltip={points.available.toLocaleString()}
                    value={points.available} 
                    formatValue={(value: number) => NumberUtility.shorten(value)}
                  />
                  <h1 className="my-available-points-label passion-one-font">Available</h1>
                </div>
                <div className="my-total-points-wrapper">
                  <AnimatedCounter 
                    className="my-total-points"   
                    initialValue={points.total} 
                    tooltip={points.total.toLocaleString()}
                    value={points.total} 
                    formatValue={(value: number) => NumberUtility.shorten(value)}
                  />
                  <h1 className="my-total-points-label passion-one-font">Total Points</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
}