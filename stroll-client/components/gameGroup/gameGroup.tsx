import React from "react";

import { EmptyMessage } from "../emptyMessage/emptyMessage";
import { GameList } from "./gameList";

import { GameGroupUtility } from "./utilities/gameGroupUtility";

import { IGameGroup } from "../../../stroll-models/gameGroup";

import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameGroupProps { 
  groups: IGameGroup[];
  status: GameStatus;
}

export const GameGroup: React.FC<GameGroupProps> = (props: GameGroupProps) => {  
  const groups: IGameGroup[] = props.groups.filter((group: IGameGroup) => group.gameStatus === props.status);

  const empty: boolean = groups
    .filter((group: IGameGroup) => group.games.length === 0)
    .length === groups.length;

  const getLists = (): JSX.Element[] => {    
    if(!empty) {
      return groups.map((group: IGameGroup) => {
        return (
          <GameList 
            key={group.groupBy}
            games={group.games}
            groupBy={group.groupBy}
            status={group.gameStatus}
            viewAll
          />
        )
      });
    }
  }

  const getEmptyMessage = (): JSX.Element => {
    if(empty) {      
      return (
        <EmptyMessage text={GameGroupUtility.getAllEmptyMessage(props.status)} />
      )
    }
  }

  return (
    <div className="game-group">
      <div className="game-group-title">
        <h1 className="game-group-title-text passion-one-font">{props.status}</h1>     
      </div>
      <div className="game-group-lists">
        {getLists()}   
        {getEmptyMessage()}
      </div>
    </div>
  );
}