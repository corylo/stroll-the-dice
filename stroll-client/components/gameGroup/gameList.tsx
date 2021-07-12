import React from "react";

import { EmptyMessage } from "../emptyMessage/emptyMessage";
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

  const getEmptyMessage = (): JSX.Element => {
    if(games.length === 0) {
      return (
        <EmptyMessage text={props.emptyMessage} />
      )
    }
  }

  return (
    <div className="game-list">
      {getTitle()}
      {getLinks()}
      {getEmptyMessage()}
    </div>
  )
}