import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Leaderboard, LeaderboardSort } from "../../../../components/leaderboard/leaderboard";
import { Matchups } from "../matchups/matchups";
import { MyFunds } from "../myFunds/myFunds";
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

  const { game, invite, player, players, status, toggles } = state;

  if(status === RequestStatus.Success && game !== null) {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    const togglePlayers = (): any => {
      if(player) {
        return () => toggle({ players: true });
      }
    }

    const getLeaderboard = (): JSX.Element => {   
      if(game.status !== GameStatus.Upcoming) {
        return (
          <Leaderboard 
            players={players.slice(0, 4)} 
            showTitle
            sort={LeaderboardSort.Funds} 
            toggleView={() => toggle({ players: true })}
          />
        )
      }
    }

    const getMatchups = (): JSX.Element[] => {        
      return MatchupUtility.groupByDay(state.matchups)
        .map((entry: any) => (
          <Matchups 
            key={entry.day} 
            day={entry.day} 
            matchups={entry.matchups} 
          />
        ));
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
            creator={game.creator}
            invite={invite}
            toggleInvite={() => toggle({ invite: true })}
            toggleUpdate={() => toggle({ update: true })}
          />
          {getLeaderboard()}
          {getMatchups()}
        </div>
        <MyFunds player={player} />
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => toggle({ accept: false })} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
      </div>
    )
  }

  return null;
}