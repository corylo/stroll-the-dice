import React from "react";
import classNames from "classnames";

import { Label } from "../label/label";

import { Icon } from "../../../stroll-enums/icon";

interface GameStatProps {  
  dailyValue: string;
  icon: Icon;
  label: string;
  value: string;
}

export const GameStat: React.FC<GameStatProps> = (props: GameStatProps) => {  
  return (
    <div className="game-stat-wrapper">
      <div className="game-stat">
        <i className={classNames("game-stat-icon", props.icon)} />
        <div className="game-stat-details">
          <Label className="game-stat-value" text={props.value} />      
          <h1 className="game-stat-daily-value passion-one-font">{props.dailyValue} / Day</h1>
        </div>
      </div>
    </div>
  );
}