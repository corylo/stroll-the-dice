import React from "react";

import { Button } from "../../../buttons/button";
import { EmptyMessage } from "../../../emptyMessage/emptyMessage";
import { GameLink } from "../../../gameLink/gameLink";

import { UrlUtility } from "../../../../utilities/urlUtility";

import { IGame } from "../../../../../stroll-models/game";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { GroupGameBy } from "../../../../../stroll-enums/groupGameBy";

interface GameListProps {  
  emptyMessage?: string;
  games: IGame[];  
  groupBy: GroupGameBy;
  status: GameStatus;
  viewAll?: boolean;
}

export const GameList: React.FC<GameListProps> = (props: GameListProps) => {  
  const { games } = props;
  
  const getLinks = (): JSX.Element => {
    const links: JSX.Element[] = games.map((game: IGame) => 
      <GameLink key={game.id} game={game} />);

    return (
      <div className="game-list-links">
        {links}
      </div>
    )
  }

  const getViewAllButton = (): JSX.Element => {
    if(props.viewAll) {
      return (
        <Button 
          className="view-all-button passion-one-font" 
          url={`/profile/games?status=${UrlUtility.format(props.status)}&type=${UrlUtility.format(props.groupBy)}`}
        >
          View All
        </Button>
      )
    }
  }

  if(games.length !== 0) {
    return (
      <div className="game-list">          
        <div className="game-list-content">
          <div className="game-list-title">
            <h1 className="game-list-title-text passion-one-font">{props.groupBy}</h1>
            {getViewAllButton()}
          </div>
          {getLinks()}          
        </div>
      </div>
    )
  }

  if(props.emptyMessage) {
    return (      
      <EmptyMessage text={props.emptyMessage} />
    )
  }

  return null;
}