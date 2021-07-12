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
    const { points } = props.player;

    return ReactDOM.createPortal(
      <div className="my-points-modal">
        <div className="my-points-wrapper">
          <div className="my-points">            
            <div className="my-points-content-wrapper">
              <div className="my-points-content">
                <div className="my-available-points-wrapper">
                  <h1 className="my-total-points-label passion-one-font"><span className="highlight-white">Available</span><span className="divider">/</span>Total Points</h1>
                  <Label 
                    className="my-available-points passion-one-font"      
                    icon="fal fa-sack-dollar"            
                    text={NumberUtility.shorten(points.available)} 
                    tooltip={points.available.toLocaleString()}
                  />
                </div>
                <div className="my-total-points-wrapper">
                  <Label 
                    className="my-total-points passion-one-font"    
                    text={NumberUtility.shorten(points.total)} 
                    tooltip={points.total.toLocaleString()}
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