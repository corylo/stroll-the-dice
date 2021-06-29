import React from "react";
import ReactDOM from "react-dom";

import { Label } from "../../../../components/label/label";

import { NumberUtility } from "../../../../../stroll-utilities/numberUtility";

import { IPlayer } from "../../../../../stroll-models/player";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

interface MyFundsProps {  
  player: IPlayer;
}

export const MyFunds: React.FC<MyFundsProps> = (props: MyFundsProps) => {    
  if(props.player.id !== "") {
    return ReactDOM.createPortal(
      <div className="my-funds-modal">
        <div className="my-funds-wrapper">
          <div className="my-funds">            
            <div className="my-funds-content-wrapper">
              <div className="my-funds-content">
                <Label 
                  className="passion-one-font" 
                  icon="fal fa-money-bill-wave-alt" 
                  text={NumberUtility.shorten(props.player.funds)} 
                  tooltip={props.player.funds.toLocaleString()}
                  tooltipSide={TooltipSide.Top}
                />
              </div>
              <h1 className="my-funds-label passion-one-font">My Funds</h1>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return null;
}