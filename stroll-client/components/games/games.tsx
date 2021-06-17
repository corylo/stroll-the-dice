import React, { useContext } from "react";

import { GameLink } from "../gameLink/gameLink";

import { AppContext } from "../app/contexts/appContext";

import { useFetchGamesEffect } from "../../effects/gameEffects";

import { IGame } from "../../../stroll-models/game";

interface GamesProps {  
  limit: number;
  title?: string;
  get: (uid: string, limit: number) => Promise<IGame[]>;
}

export const Games: React.FC<GamesProps> = (props: GamesProps) => {  
  const { appState } = useContext(AppContext);

  const { limit, title, get } = props;
  
  const { games, status } = useFetchGamesEffect(appState, limit, get);

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