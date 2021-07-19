import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { EventHistoryToggle } from "../eventHistory/eventHistoryToggle/eventHistoryToggle";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { MatchupGroup } from "../matchupGroup/matchupGroup";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { UserLink } from "../../../../components/userLink/userLink";
import { StartingSoonMessage } from "../startingSoonMessage/startingSoonMessage";
import { ViewEventsModal } from "../viewEventsModal/viewEventsModal";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { GameEventUtility } from "../../../../../stroll-utilities/gameEventUtility";

import { AppStatus } from "../../../../enums/appStatus";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface GamePageContentProps {
  
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { appState } = useContext(AppContext);

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
    
    const getEventHistoryToggle = (): JSX.Element => {      
      if(player.id !== "") {
        return (
          <EventHistoryToggle toggle={toggle} />
        );
      }
    }

    const getGamePageContentForPlayer = (): JSX.Element => {
      if(player.id !== "") {
        const getMaxDay = (): number => {          
          if(game.status === GameStatus.InProgress) {
            return Math.min(state.day + 1, game.duration);
          } else if (game.status === GameStatus.Completed) {
            return game.duration;
          }

          return 1;
        }

        const getMatchups = (): JSX.Element[] => {    
          const max: number = getMaxDay();
          
          const matchupGroups: JSX.Element[] = [];
  
          for(let i: number = max; i > 0; i--) {
            matchupGroups.push(
              <MatchupGroup key={i} day={i} />
            )
          }      
  
          return matchupGroups;
        }

        return (
          <React.Fragment>
            <StartingSoonMessage 
              day={state.day} 
              limit={59} 
              startsAt={game.startsAt}                 
              status={game.status}
            />
            <Leaderboard 
              limit={4}
              players={players} 
              gameStatus={game.status} 
              toggleView={() => toggle({ players: true })}
            />
            {getMatchups()}
          </React.Fragment>
        )
      } else if (
        appState.status === AppStatus.SignedOut || 
        (game.id !== "" && player.id === "" && statuses.players !== RequestStatus.Loading)
      ) {
        return (
          <EmptyMessage text="Sign in or request an invite from the creator to gain access to this game!" />
        )
      }
    }

    const handleViewEventsToggle = (): void => {
      toggle({ events: false });

      GameEventUtility.setLastViewedAt();
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
          <div className="game-action-bar">
            <GameActions 
              game={game}
              invite={invite}
              toggleInvite={() => toggle({ invite: true })}
              toggleUpdate={() => toggle({ update: true })}
            />
            {getEventHistoryToggle()}
          </div>
          {getGamePageContentForPlayer()}
        </div>
        <MyPoints player={player} />
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => toggle({ accept: false })} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
        <ViewEventsModal back={handleViewEventsToggle} />
      </div>
    )
  }

  return null;
}