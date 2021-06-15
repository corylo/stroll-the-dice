import React from "react";

import { GameLink } from "../gameLink/gameLink";

import { IGame } from "../../../stroll-models/game";

interface GamesProps {  
  games: IGame[];
  title?: string;
}

export const Games: React.FC<GamesProps> = (props: GamesProps) => {  
  const { games, title } = props;
  
  if(games.length > 0) {
    const links: JSX.Element[] = games.map((game: IGame) =>         
      <GameLink key={game.id} game={game} />
    );

    const getTitle = (): JSX.Element => {
      if(title) {
        return (
          <div className="games-title">
            <h1 className="passion-one-font">{title}</h1>
          </div>
        )
      }
    }

    return (
      <div className="games">
        {getTitle()}
        <div className="game-links">
          {links}
        </div>
      </div>
    )
  }

  return null;
}