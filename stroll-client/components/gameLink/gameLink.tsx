import React from "react";

import { Button } from "../buttons/button";
import { GameDetails } from "../gameDetails/gameDetails";
import { StartingIn } from "../startingIn/startingIn";
import { UserLink } from "../userLink/userLink";

import { IGame } from "../../../stroll-models/game";

interface GameLinkProps {  
  game: IGame;
}

export const GameLink: React.FC<GameLinkProps> = (props: GameLinkProps) => {  
  const { game } = props;

  return ( 
    <div className="game-link-wrapper">
      <Button key={game.id} className="game-link" url={`/game/${game.id}`} />
      <UserLink profile={game.creator} tooltip="Creator" />
      <StartingIn timestamp={game.startsAt} />
      <div className="game-link-body">
        <h1 className="game-name passion-one-font">{game.name}</h1>
      </div>
      <GameDetails game={game} />
    </div>
  ); 
}