import React from "react";

import { GameLink } from "../gameLink/gameLink";

import { IGame } from "../../../stroll-models/game";

interface GameListProps {  
  emptyMessage: string;
  games: IGame[];  
  title?: string;
}

export const GameList: React.FC<GameListProps> = (props: GameListProps) => {  
  const { games, title } = props;
  
  const getTitle = (): JSX.Element => {
    if(title) {
      return (
        <div className="game-list-title">
          <h1 className="passion-one-font">{title}</h1>
        </div>
      )
    }
  }

  const getLinks = (): JSX.Element => {
    const links: JSX.Element[] = games.map((game: IGame) => 
      <GameLink key={game.id} game={game} />);

    return (
      <div className="game-list-links">
        {links}
      </div>
    )
  }

  if(games.length !== 0) {
    return (
      <div className="game-list">      
        <div className="game-list-border" />      
        <div className="game-list-content">
          {getTitle()}
          {getLinks()}          
        </div>
      </div>
    )
  }

  return null;
}