import React, { useContext } from "react";

import { Dot } from "../../../../components/dot/dot";
import { IconButton } from "../../../../components/buttons/iconButton";
import { UpdateGameButton } from "../updateGameButton/updateGameButton";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { IGame } from "../../../../../stroll-models/game";
import { IInvite } from "../../../../../stroll-models/invite";

import { AppStatus } from "../../../../enums/appStatus";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";

interface GameActionsProps {  
  game: IGame;
  invite: IInvite;
  toggleInvite: () => void;
  toggleUpdate: () => void;
}

export const GameActions: React.FC<GameActionsProps> = (props: GameActionsProps) => {
  const { appState } = useContext(AppContext);

  const { game, invite } = props;

  let actions: JSX.Element[] = [];

  if(appState.status === AppStatus.SignedIn) {
    if(invite && game.status === GameStatus.Upcoming) {    
      actions.push(
        <IconButton
          key="invite"
          className="invite-button inline-icon-button"
          icon="fal fa-user-plus" 
          tooltip="Invite"
          handleOnClick={props.toggleInvite} 
        />      
      )
    }

    if(game.creator.uid === appState.user.profile.uid) {
      if(actions.length === 1) {
        actions.push(<Dot  />);
      }

      actions.push(
        <UpdateGameButton 
          key="update"
          creator={game.creator} 
          toggle={props.toggleUpdate} 
        />
      );
    }

    if(actions.length > 0) {
      return (
        <div className="game-actions">    
          {actions}
        </div>
      );
    }
  }

  return null;
}