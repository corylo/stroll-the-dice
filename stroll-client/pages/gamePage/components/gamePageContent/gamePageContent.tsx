import React, { useContext } from "react";

import { AcceptInviteModal } from "../acceptInviteModal/acceptInviteModal";
import { Confetti } from "../../../../components/confetti/confetti";
import { EmptyMessage } from "../../../../components/emptyMessage/emptyMessage";
import { GameActions } from "../gameActions/gameActions";
import { GameDateStatus } from "../../../../components/gameDateStatus/gameDateStatus";
import { GameDetails } from "../../../../components/gameDetails/gameDetails";
import { GameTimelineToggle } from "../gameTimeline/gameTimelineToggle/gameTimelineToggle";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InvitePlayersModal } from "../invitePlayersModal/invitePlayersModal";
import { Label } from "../../../../components/label/label";
import { Leaderboard } from "../../../../components/leaderboard/leaderboard";
import { GameDay } from "../gameDay/gameDay";
import { MyPoints } from "../myPoints/myPoints";
import { UpdateGameModal } from "../updateGameModal/updateGameModal";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";
import { StartingSoonMessage } from "../startingSoonMessage/startingSoonMessage";
import { TooltipSide } from "../../../../components/tooltip/tooltip";
import { ViewGameTimelineModal } from "../viewGameTimelineModal/viewGameTimelineModal";
import { ViewPlayersModal } from "../viewPlayersModal/viewPlayersModal";

import { AppContext } from "../../../../components/app/contexts/appContext";
import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";
import { RoleUtility } from "../../../../../stroll-utilities/roleUtility";

import { AppAction } from "../../../../enums/appAction";
import { AppStatus } from "../../../../enums/appStatus";
import { GameError } from "../../../../../stroll-enums/gameError";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { PlayerStatus } from "../../../../../stroll-enums/playerStatus";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

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
        RoleUtility.isAdmin(appState.user.roles)
      ) {
        return () => toggle({ players: true });
      }
    }
    
    const getGameTimelineToggle = (): JSX.Element => {      
      if(
        statuses.player === PlayerStatus.Playing ||
        RoleUtility.isAdmin(appState.user.roles)
      ) {
        return (
          <GameTimelineToggle toggle={toggle} />
        );
      }
    }

    const getGamePageContentForPlayer = (): JSX.Element => {
      if(statuses.player === PlayerStatus.Playing || RoleUtility.isAdmin(appState.user.roles)) {
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

        const getGameDays = (): JSX.Element[] => {                    
          if(game.error === GameError.None) { 
            const max: number = getMaxDay();
            
            const gameDays: JSX.Element[] = [];
    
            for(let i: number = max; i > 0; i--) {
              gameDays.push(<GameDay key={i} day={i} />);
            }      
    
            return gameDays;
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
            {getGameDays()}
          </React.Fragment>
        )
      } else if (appState.status === AppStatus.SignedOut) {
        return (
          <EmptyMessage text="Sign in to gain access to this game!" />
        )
      } else if (
        game.id !== "" && 
        statuses.player === PlayerStatus.NotPlaying && 
        statuses.players !== RequestStatus.Loading
      ) {
        return (
          <EmptyMessage text="Request an invite from the creator to gain access to this game!" />
        )
      }
    }

    const getConfetti = (): JSX.Element => {
      const endOfFinalDayUpdateComplete: boolean = FirestoreDateUtility.endOfDayProgressUpdateComplete(state.game.duration, game.startsAt, game.progressUpdateAt);

      if(game.status === GameStatus.Completed && endOfFinalDayUpdateComplete) {
        return (
          <Confetti />
        );
      }
    }
    
    return (
      <div className="game-page-content">
        <div className="game-page-header">
          <PlayerStatement profile={state.creator} />
          <GameDateStatus game={game} />
        </div>
        <div className="game-page-body">
          <h1 className="game-name passion-one-font">{game.name}</h1> 
          <Label
            className="game-dates passion-one-font"
            icon="fal fa-clock"
            text={FirestoreDateUtility.getShortenedDateTimeRange(game.startsAt, game.endsAt)}
          />   
          <GameDetails game={game} togglePlayers={togglePlayers()} />
          <div className="game-action-bar">
            <GameActions 
              game={game}
              invite={invite}
              toggleInvite={() => toggle({ invite: true })}
              toggleUpdate={() => toggle({ update: true })}
            />
            {getGameTimelineToggle()}
          </div>
          {getGamePageContentForPlayer()}
        </div>
        {getConfetti()}
        <MyPoints />
        <UpdateGameModal back={() => toggle({ update: false })} />
        <AcceptInviteModal back={() => dispatch(AppAction.ToggleAcceptInvite, false)} />
        <InvitePlayersModal back={() => toggle({ invite: false })} />
        <ViewPlayersModal back={() => toggle({ players: false })} />
        <ViewGameTimelineModal back={() => toggle({ events: false })} />
      </div>
    )
  }

  return null;
}