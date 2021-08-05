import React from "react";

import { AnimatedCounter } from "../animatedCounter/animatedCounter";

import { Icon } from "../../../stroll-enums/icon";

interface GameDayStatementProps {  
  quantity: number;
}

export const GameDayStatement: React.FC<GameDayStatementProps> = (props: GameDayStatementProps) => {  
  const quantity: JSX.Element = (                   
    <AnimatedCounter 
      initialValue={props.quantity} 
      value={props.quantity} 
      formatValue={(value: number) => value.toLocaleString()} 
    />
  )
  
  return (
    <span className="game-day-statement"><i className={Icon.OneGameDay} /> {quantity} Game Days</span>
  );
}