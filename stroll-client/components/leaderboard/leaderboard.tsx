import React, { useContext } from "react";
import _orderBy from "lodash.orderby";

import { Button } from "../buttons/button";
import { LeaderboardRow } from "./leaderboardRow/leaderboardRow";
import { LeaderboardTopRow } from "./leaderboardTopRow/leaderboardTopRow";
import { LoadingMessage } from "../loadingMessage/loadingMessage";

import { GamePageContext } from "../../pages/gamePage/gamePage";

import { IPlayer } from "../../../stroll-models/player";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

export enum LeaderboardSort {
  Alphabetical = "Alphabetical",
  Points = "Points",
  Steps = "Steps"
}

interface LeaderboardProps {  
  limit?: number;
  players: IPlayer[];
  showTitle?: boolean;
  sort: LeaderboardSort;
  toggleView?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = (props: LeaderboardProps) => {   
  const { state } = useContext(GamePageContext);

  const { game, players, statuses } = state;

  if(game.status !== GameStatus.Upcoming && statuses.players !== RequestStatus.Idle) {
    const getTopRows = (players: IPlayer[]): JSX.Element => {
      const first: IPlayer = players[0],
        second: IPlayer = players[1],
        third: IPlayer = players[2];
      
      return (
        <div className="leaderboard-top-rows">
          <LeaderboardTopRow place={2} player={second} />
          <LeaderboardTopRow place={1} player={first} />
          <LeaderboardTopRow place={3} player={third} />
        </div>
      )
    }

    const getRemainingRows = (players: IPlayer[], start?: number): JSX.Element => {
      const rows: JSX.Element[] = players.map((player: IPlayer, index: number) =>
        <LeaderboardRow key={player.id} place={index + (start || 1)} player={player} />
      );

      return (
        <div className="leaderboard-remaining-rows">
          {rows}
        </div>
      )
    }
  
    const getRows = (): JSX.Element => {
      if(props.sort === LeaderboardSort.Alphabetical || props.players.length < 4) {
        const players: IPlayer[] = _orderBy(props.players, (player: IPlayer) => player.profile.username.toLowerCase(), "asc");

        return getRemainingRows(players);
      } else {
        const players: IPlayer[] = _orderBy(
          props.players, 
          ["points.total", (player: IPlayer) => player.profile.username.toLowerCase()], 
          ["desc", "asc"]
        ).slice(0, props.limit || props.players.length);

        const remainingRows: JSX.Element = players.length > 3
          ? getRemainingRows(players.slice(3), 4)
          : null;

        return (
          <React.Fragment>
            {getTopRows(players.slice(0, 3))}
            {remainingRows}
          </React.Fragment>
        )
      }
    }

    const getTitle = (): JSX.Element => {
      if(props.showTitle) {
        return (
          <h1 className="leaderboard-title passion-one-font">Leaderboard</h1>
        )
      }
    }

    const getViewButton = (): JSX.Element => {
      if(props.toggleView) {
        return (
          <Button className="view-leaderboard-button passion-one-font" handleOnClick={props.toggleView}>View Full Leaderboard</Button>
        )
      }
    }

    const getLeaderboardContent = (): JSX.Element => {
      if(
        statuses.players === RequestStatus.Success &&
        players.length > 3
      ) {
        return (
          <React.Fragment>
            {getTitle()}
            <div className="leaderboard-rows">
              {getRows()}
            </div>
            {getViewButton()}
          </React.Fragment>
        );
      }
    }
    
    const getLoadingMessage = (): JSX.Element => {
      if(statuses.players === RequestStatus.Loading) {
        return (
          <LoadingMessage borderless text="Loading Players" />
        )
      }
    }  

    return (
      <div className="leaderboard">
        {getLeaderboardContent()}
        {getLoadingMessage()}
      </div>
    );
  }

  return null;
}