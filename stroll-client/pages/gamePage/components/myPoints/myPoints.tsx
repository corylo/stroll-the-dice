import React from "react";
import ReactDOM from "react-dom";

import { Label } from "../../../../components/label/label";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { IPlayer } from "../../../../../stroll-models/player";

interface MyPointsProps {  
  player: IPlayer;
}

export const MyPoints: React.FC<MyPointsProps> = (props: MyPointsProps) => {    
  if(props.player.id !== "") {
    return ReactDOM.createPortal(
      <div className="my-points-modal">
        <div className="my-points-wrapper">
          <div className="my-points">            
            <div className="my-points-content-wrapper">
              <div className="my-points-content">
                <Label 
                  className="passion-one-font" 
                  icon="fal fa-sack-dollar" 
                  text={NumberUtility.shorten(props.player.points.available)} 
                  tooltip={props.player.points.available.toLocaleString()}
                  tooltipSide={TooltipSide.Top}
                />
              </div>
              <h1 className="my-points-label passion-one-font">My Points</h1>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
}