import React, { useContext } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { AnimatedCounter } from "../../../../components/animatedCounter/animatedCounter";

import { GamePageContext } from "../../gamePage";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { Icon } from "../../../../../stroll-enums/icon";

interface MyPointsProps {  
  
}

export const MyPoints: React.FC<MyPointsProps> = (props: MyPointsProps) => {    
  const { player } = useContext(GamePageContext).state;

  if(player.id !== "") {
    const { points } = player;

    return ReactDOM.createPortal(
      <div className="my-points-modal">
        <div className="my-points-wrapper">
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