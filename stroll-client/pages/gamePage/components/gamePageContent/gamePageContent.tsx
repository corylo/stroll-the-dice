import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { EventHistoryToggle } from "../eventHistory/eventHistoryToggle/eventHistoryToggle";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Label } from "../../../../components/label/label";
import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { MatchupGroup } from "../matchupGroup/matchupGroup";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { StartingSoonMessage } from "../startingSoonMessage/startingSoonMessage";
import { TooltipSide } from "../../../../components/tooltip/tooltip";
import { ViewEventsModal } from "../viewEventsModal/viewEventsModal";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { AppAction } from "../../../../enums/appAction";
import { AppStatus } from "../../../../enums/appStatus";
import { GameError } from "../../../../../stroll-enums/gameError";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { Role } from "../../../../../stroll-enums/role";

interface GamePageContentProps {
  
}

export const GamePageContent: React.FC<GamePageContentProps> = (props: GamePageContentProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const { state, setState } = useContext(GamePageContext);

  const { 
    game, 
    invite, 
    players, 
    statuses,
    toggles 
  } = state;

  if(statuses.game === RequestStatus.Success) {
    const toggle = (updates: any): void => {
      setState({ ...state, toggles: { ...toggles, ...updates } });
    }

    const togglePlayers = (): any => {      
      if(
        statuses.player === PlayerStatus.Playing ||
        appState.user.roles.includes(Role.Admin)
      ) {
        return () => toggle({ players: true });
      }
    }
    
    const getEventHistoryToggle = (): JSX.Element => {      
      if(
        statuses.player === PlayerStatus.Playing ||
        appState.user.roles.includes(Role.Admin)
      ) {
        return (
          <EventHistoryToggle toggle={toggle} />
        );
      }
    }

    const getGamePageContentForPlayer = (): JSX.Element => {
      if(statuses.player === PlayerStatus.Playing || appState.user.roles.includes(Role.Admin)) {
        const getMaxDay = (): number => {          
          if(game.status === GameStatus.InProgress) {
            return Math.min(state.day + 1, game.duration);
          } else if (game.status === GameStatus.Completed) {
            return game.duration;
          }

          return 1;
        }

        const getMinimumPlayerRequirementMessage = (): JSX.Element => {   
          if(game.counts.players < 4) {
            return (
              <div className="minimum-player-requirement-message-wrapper">
                <Label
                  className="minimum-player-requirement-message"
                  icon="fal fa-info-circle"
                  text="Minimum of 4 players required"
                />               
                <div className="game-action-button-wrapper"> 
                  <IconButton
                    key="invite"
                    className="game-action-button"
                    icon="fal fa-user-plus" 
                    tooltip="Invite"
                    tooltipSide={TooltipSide.Bottom}
                    handleOnClick={() => toggle({ invite: true })} 
                  />
                </div>
              </div>
            )
          }
        }

        const getMatchupGroups = (): JSX.Element[] => {                    
          if(game.error === GameError.None) { 
            const max: number = getMaxDay();
            
            const matchupGroups: JSX.Element[] = [];
    
            for(let i: number = max; i > 0; i--) {
              matchupGroups.push(
                <MatchupGroup key={i} day={i} />
              )
            }      
    
            return matchupGroups;
          }
        }

        const getDidNotMeetMinimumPlayerRequirementMessage = (): JSX.Element => {
          if(game.error === GameError.PlayerMinimumNotMet) {        
            return (          
              <EmptyMessage      
                className="game-not-started-message"           
                text="This game did not meet the minimum player requirement of 4. Please adjust the start date or time and then invite more players." 
                title="Game Not Started!"
              /> 
            )
          }
        }

        return (
          <React.Fragment>            
            {getMinimumPlayerRequirementMessage()}
            <StartingSoonMessage 
              limit={59} 
              error={game.error}
              startsAt={game.startsAt}                 
              status={game.status}
            />
            {getDidNotMeetMinimumPlayerRequirementMessage()}
            <Leaderboard 
              id="game-page-content-leaderboard"
              limit={4}
              players={players} 
              gameStatus={game.status} 
              toggleView={() => toggle({ players: true })}
            />
            {getMatchupGroups()}
          </React.Fragment>
        )
      } else if (appState.status === AppStatus.SignedOut) {
        return (
          <EmptyMessage text="Sign in to gain access to this game!" />
        )
      } else if (
        game.id !== "" && 
        statuses.player === PlayerStatus.NotPlaying && 
        statuses.players !== RequestStatus.Loading &&
        invite !== null
      ) {
        return (
          <EmptyMessage text="Request an invite from the creator to gain access to this game!" />
        )
      }
    }

    return (
      <div className="game-page-content">
        <div className="game-page-header">
          <PlayerStatement profile={game.creator} />
          <GameDateStatus game={game} />
        </div>
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1> 
          <Label
            className="game-dates passion-one-font"
            icon="fal fa-clock"
            text={FirestoreDateUtility.getShortenedDateTimeRange(game.startsAt, game.endsAt)}
            tooltip={`${FirestoreDateUtility.timestampToLocaleDateTime(game.startsAt)} - ${FirestoreDateUtility.timestampToLocaleDateTime(game.endsAt)}`}
            tooltipSide={TooltipSide.BottomLeft}
          />   
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
        <MyPoints />
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => dispatch(AppAction.ToggleAcceptInvite, false)} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
        <ViewEventsModal back={() => toggle({ events: false })} />
      </div>
    )
  }

  return null;
}