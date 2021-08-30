import React from "react";

interface GameStatProps {  
  label: string;
  value: string;
}

export const GameStat: React.FC<GameStatProps> = (props: GameStatProps) => {  
  return (
    <div className="game-stat">
      <h1 className="game-stat-value passion-one-font">{props.value}</h1>
      <h1 className="game-stat-label passion-one-font">{props.label}</h1>
    </div>
  );
}