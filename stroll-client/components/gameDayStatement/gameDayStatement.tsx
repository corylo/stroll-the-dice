import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface GameDayStatementProps {  
  quantity: number;
}

export const GameDayStatement: React.FC<GameDayStatementProps> = (props: GameDayStatementProps) => {      
  return (
    <span className="game-day-statement"><i className={Icon.OneGameDay} /> {props.quantity} Game Days</span>
  );
}