import React from "react";

import { Button } from "../buttons/button";
import { GameDetails } from "../gameDetails/gameDetails";

import { IGame } from "../../../stroll-models/game";

interface GameLinkProps {  
  game: IGame;
}

export const GameLink: React.FC<GameLinkProps> = (props: GameLinkProps) => {  
  const { game } = props;

  return ( 
    <div className="game-link-wrapper">
      <GameDetails game={game} />
      <Button key={game.id} className="game-link" url={`/game/${game.id}`} />
      <div className="game-link-body">
        <h1 className="game-name passion-one-font">{game.name}</h1>
      </div>
    </div>
  ); 
}