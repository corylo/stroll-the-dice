import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Leaderboard, LeaderboardSort } from "../../../../components/leaderboard/leaderboard";
import { MatchupGroup } from "../matchupGroup/matchupGroup";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { UserLink } from "../../../../components/userLink/userLink";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { GamePageContext } from "../../gamePage";

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
    statuses,
    toggles 
  } = state;

  if(statuses.game === RequestStatus.Success) {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    const togglePlayers = (): any => {      
      if(player.id !== "") {
        return () => toggle({ players: true });
      }
    }

    const getGamePageContentForPlayer = (): JSX.Element => {
      if(player.id !== "") {
        const getLeaderboard = (): JSX.Element => {
          if(game.status !== GameStatus.Upcoming && players.length > 4) {
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

        const getMatchups = (): JSX.Element[] => {    
          let max: number = state.game.status === GameStatus.Upcoming ? 1 : state.game.duration,
            matchupGroups: JSX.Element[] = [];
  
          for(let i: number = max; i > 0; i--) {
            matchupGroups.push(
              <MatchupGroup key={i} day={i} />
            )
          }      
  
          return matchupGroups;
        }

        return (
          <React.Fragment>
            {getLeaderboard()}
            {getMatchups()}
          </React.Fragment>
        )
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
          {getGamePageContentForPlayer()}
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