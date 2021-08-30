import React from "react";

import { Label } from "../../../../components/label/label";

import { Icon } from "../../../../../stroll-enums/icon";

interface GameStatProps {  
  dailyValue: string;
  icon: Icon;
  label: string;
  value: string;
}

export const GameStat: React.FC<GameStatProps> = (props: GameStatProps) => {  
  return (
    <div className="game-stat">
      <Label
        className="game-stat-value"
        icon={props.icon}
        text={props.value}
      />
      <h1 className="game-stat-daily-value passion-one-font">{props.dailyValue} / Day</h1>
    </div>
  );
}