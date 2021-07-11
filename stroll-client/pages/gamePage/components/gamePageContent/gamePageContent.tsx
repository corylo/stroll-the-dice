import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Leaderboard, LeaderboardSort } from "../../../../components/leaderboard/leaderboard";
import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";
import { Matchups } from "../matchups/matchups";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { UserLink } from "../../../../components/userLink/userLink";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { GamePageContext } from "../../gamePage";

import { MatchupUtility } from "../../../../utilities/matchupUtility";

import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GamePageContentProps {
  
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { state, setState } = useContext(GamePageContext);

  const { 
    game, 
    invite, 
    player, 
    players, 
    status, 
    toggles 
  } = state;

  if(status === RequestStatus.Success && game.id !== "") {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    const togglePlayers = (): any => {      
      if(player.id !== "") {
        return () => toggle({ players: true });
      }
    }

    const getLeaderboard = (): JSX.Element => {   
      if(game.status !== GameStatus.Upcoming && players.length > 3) {
        if(state.statuses.players === RequestStatus.Loading) {
          return (
            <LoadingMessage text="Loading players" />
          )
        } else {
          return (
            <Leaderboard 
              limit={4}
              players={players} 
              showTitle
              sort={LeaderboardSort.Points} 
              toggleView={() => toggle({ players: true })}
            />
          )
        }
      } 
    }

    const getMatchups = (): JSX.Element | JSX.Element[] => {    
      if(state.player.id !== "") {
        if(state.statuses.matchups === RequestStatus.Loading) {          
          return (
            <LoadingMessage text="Loading matchups" />
          )
        }
          
        return MatchupUtility.groupByDay(state.matchups)
          .map((entry: any) => (
            <Matchups 
              key={entry.day} 
              day={entry.day} 
              duration={game.duration}
              matchups={entry.matchups} 
            />
          ));
      }
    }

    return (
      <div className="game-page-content">
        <div className="game-page-header">
          <UserLink profile={game.creator} tooltip="Creator" />
          <GameDateStatus game={game} />
        </div>
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1>
          <GameDetails game={game} togglePlayers={togglePlayers()} />
          <GameActions 
            game={game}
            invite={invite}
            toggleInvite={() => toggle({ invite: true })}
            toggleUpdate={() => toggle({ update: true })}
          />
          {getLeaderboard()}
          {getMatchups()}
        </div>
        <MyPoints player={player} />
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => toggle({ accept: false })} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
      </div>
    )
  }

  return null;
}