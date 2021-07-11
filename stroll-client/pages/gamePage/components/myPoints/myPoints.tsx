import React from "react";
import ReactDOM from "react-dom";

import { Label } from "../../../../components/label/label";

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
                <div className="my-available-points-wrapper">
                  <Label 
                    className="my-available-points passion-one-font" 
                    icon="fal fa-sack-dollar" 
                    text={NumberUtility.shorten(props.player.points.available)} 
                    tooltip="My Available Points"
                  />
                </div>
                <div className="my-total-points-wrapper">
                  <h1 className="divider passion-one-font">
                    <span className="highlight-main">/</span>
                  </h1>
                  <Label 
                    className="my-total-points passion-one-font"                   
                    text={NumberUtility.shorten(props.player.points.total)} 
                    tooltip="My Total Points"
                  />
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