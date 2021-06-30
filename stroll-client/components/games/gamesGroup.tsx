import React from "react";

interface GamesGroupProps {  
  children: any;
  title: string;
}

export const GamesGroup: React.FC<GamesGroupProps> = (props: GamesGroupProps) => {  
  return (
    <div className="games-group">
      <div className="games-group-title">
        <h1 className="passion-one-font">{props.title}</h1>
      </div>
      <div className="games-group-items">
        {props.children}        
      </div>
    </div>
  );
}