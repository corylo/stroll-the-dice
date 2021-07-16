import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Label } from "../../../../components/label/label";
import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { LoadingMessage } from "../../../../components/loadingMessage/loadingMessage";
import { MatchupGroup } from "../matchupGroup/matchupGroup";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { UserLink } from "../../../../components/userLink/userLink";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";
import { ViewEventsModalWrapper } from "../viewEventsModal/viewEventsModalWrapper";

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

    const getEventHistoryToggle = (): JSX.Element => {      
      if(player.id !== "") {
        return (
          <Label 
            className="events-button passion-one-font" 
            icon="fal fa-history"
            text="Timeline"
            handleOnClick={() => toggle({ events: true })}
          />
        )
      }
    }

    const getGamePageContentForPlayer = (): JSX.Element => {
      if(player.id !== "") {
        const getInProgressContent = (): JSX.Element => {
          const getMaxDay = (): number => {          
            if(state.game.status === GameStatus.InProgress) {
              return Math.min(state.day + 1, state.game.duration);
            } else if (state.game.status === GameStatus.Completed) {
              return state.game.duration;
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
              <Leaderboard 
                limit={4}
                players={players} 
                gameStatus={game.status} 
                toggleView={() => toggle({ players: true })}
              />
              {getMatchups()}
            </React.Fragment>
          )
        }

        if(state.day === 1 && game.status === GameStatus.Upcoming) {
          return (
            <LoadingMessage text="Starting game" />
          )
        } 
        
        return getInProgressContent();
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
        <ViewEventsModalWrapper back={() => toggle({ events: false })} />
      </div>
    )
  }

  return null;
}