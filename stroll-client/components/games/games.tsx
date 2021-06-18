import React, { useContext } from "react";
import classNames from "classnames";

import { GameLink } from "../gameLink/gameLink";
import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { AppContext } from "../app/contexts/appContext";

import { useFetchGamesEffect } from "../../effects/gameEffects";

import { IGame } from "../../../stroll-models/game";

import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface GamesProps {  
  emptyMessage: string;
  limit: number;
  title?: string;
  get: (uid: string, limit: number) => Promise<IGame[]>;
}

export const Games: React.FC<GamesProps> = (props: GamesProps) => {  
  const { appState } = useContext(AppContext);

  const { limit, title, get } = props;
  
  const { games, status } = useFetchGamesEffect(appState, limit, get);


  const getTitle = (): JSX.Element => {
    if(title) {
      return (
        <div className="games-title">
          <h1 className="passion-one-font">{title}</h1>
        </div>
      )
    }
  }

  const getLoading = (): JSX.Element => {    
    if(status === RequestStatus.Loading) {
      return (
        <LoadingIcon />
      )
    }
  }

  const getLinks = (): JSX.Element => {
    const links: JSX.Element[] = games.map((game: IGame) => 
      <GameLink key={game.id} game={game} />);

    return (
      <div className="game-links">
        {links}
        {getLoading()}
      </div>
    )
  }

  const getEmptyMessage = (): JSX.Element => {
    if(status !== RequestStatus.Loading && games.length === 0) {
      return (
        <div className="empty-message">
          <h1 className="passion-one-font">{props.emptyMessage}</h1>
        </div>
      )
    }
  }

  return (
    <div className={classNames("games", { loading: status === RequestStatus.Loading })}>
      {getTitle()}
      {getLinks()}
      {getEmptyMessage()}
    </div>
  )
}