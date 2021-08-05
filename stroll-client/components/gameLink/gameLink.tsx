import React from "react";

import { Button } from "../buttons/button";
import { GameDateStatus } from "../gameDateStatus/gameDateStatus";
import { GameDetails } from "../gameDetails/gameDetails";
import { Label } from "../label/label";
import { PlayerStatement } from "../playerStatement/playerStatement";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

import { IGame } from "../../../stroll-models/game";

interface GameLinkProps {  
  game: IGame;
}

export const GameLink: React.FC<GameLinkProps> = (props: GameLinkProps) => {  
  const { game } = props;

  return ( 
    <div className="game-link-wrapper">
      <Button key={game.id} className="game-link" url={`/game/${game.id}`} />
      <div className="game-link-header">
        <h1 className="game-link-creator-statement passion-one-font"><span className="highlight-custom">Created by</span> <PlayerStatement profile={game.creator} /></h1>
        <GameDateStatus game={game} />
      </div>
      <div className="game-link-body">
        <h1 className="game-name passion-one-font">{game.name}</h1> 
        <Label
          className="game-dates passion-one-font"
          icon="fal fa-clock"
          text={FirestoreDateUtility.getShortenedDateTimeRange(game.startsAt, game.endsAt)}
        />   
      </div>
      <GameDetails game={game} />
    </div>
  ); 
}