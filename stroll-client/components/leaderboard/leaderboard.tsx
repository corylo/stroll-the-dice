import React, { useContext } from "react";
import _orderBy from "lodash.orderby";

import { Button } from "../buttons/button";
import { LeaderboardRow } from "./leaderboardRow/leaderboardRow";
import { LeaderboardTopRow } from "./leaderboardTopRow/leaderboardTopRow";
import { LoadingMessage } from "../loadingMessage/loadingMessage";
import { PlayerStatement } from "../playerStatement/playerStatement";

import { GamePageContext } from "../../pages/gamePage/gamePage";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

import { IPlayer } from "../../../stroll-models/player";

import { GameStatus } from "../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface LeaderboardProps {  
  id: string;
  limit?: number;
  players: IPlayer[];
  gameStatus: GameStatus;
  toggleView?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = (props: LeaderboardProps) => {   
  const { state } = useContext(GamePageContext);

  const { game, statuses } = state;
  
  if(statuses.players !== RequestStatus.Idle) {
    const limit: number = props.limit || props.players.length;

    const getPlayers = (): IPlayer[] => {
      if(props.gameStatus === GameStatus.Upcoming) {
        const players: IPlayer[] = _orderBy(props.players, (player: IPlayer) => player.createdAt, "asc").slice(0, limit);

        return players;
      }
      
      const players: IPlayer[] = _orderBy(
        props.players, 
        ["points.total", "createdAt"], 
        ["desc", "asc"]
      ).slice(0, limit);

      return players;
    }

    const players: IPlayer[] = getPlayers();

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
      const rows: JSX.Element[] = players.map((player: IPlayer, index: number) => (
        <LeaderboardRow 
          key={player.id} 
          amount={player.points.total}
          place={index + (start || 1)} 
          profile={player.profile} 
        />
      ));

      return (
        <div className="leaderboard-remaining-rows">
          {rows}
        </div>
      )
    }
  
    const getRows = (): JSX.Element => {
      if(props.gameStatus === GameStatus.Upcoming || players.length < 3) {
        return getRemainingRows(_orderBy(players, (player: IPlayer) => player.createdAt, "asc"));
      } else {
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

    const getViewButton = (): JSX.Element => {
      if(props.toggleView && props.players.length > limit) {
        const text: string = props.gameStatus === GameStatus.Upcoming
        ? "Roster"
        : "Leaderboard";
        
        return (
          <Button className="view-leaderboard-button passion-one-font" handleOnClick={props.toggleView}>View Full {text}</Button>
        )
      }
    }

    const getLeaderboardContent = (): JSX.Element => {
      if(statuses.players === RequestStatus.Success) {        
        const endOfFinalDayUpdateComplete: boolean = FirestoreDateUtility.endOfDayProgressUpdateComplete(state.game.duration, game.startsAt, game.progressUpdateAt),
          inProgress: boolean = props.gameStatus === GameStatus.InProgress,
          completed: boolean = props.gameStatus === GameStatus.Completed;
        
        const getTitle = (): string => {
          if(props.gameStatus === GameStatus.Upcoming) {
            return "Roster";
          } else if(inProgress || (completed && !endOfFinalDayUpdateComplete)) {
            return "Leaderboard";
          } else if (completed && endOfFinalDayUpdateComplete) {
            return "Final Leaderboard";
          }
        }

        const getCongratulations = (): JSX.Element => {
          if(completed && endOfFinalDayUpdateComplete) {
            return (
              <h1 className="leaderboard-congratulations passion-one-font">Congratulations <PlayerStatement profile={players[0].profile} />!</h1>
            );
          }
        }
        
        return (
          <React.Fragment>
            <h1 className="leaderboard-title passion-one-font">{getTitle()}</h1>
            {getCongratulations()}
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
        <div className="leaderboard-content">
          {getLeaderboardContent()}
          {getLoadingMessage()}
        </div>
      </div>
    );
  }

  return null;
}