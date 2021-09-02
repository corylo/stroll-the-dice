import React, { useContext } from "react";

import { Button } from "../../../../components/buttons/button";
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
        <Button
          key="invite"
          className="game-action-toggle invite-toggle"
          handleOnClick={props.toggleInvite} 
        >
          <i className="fal fa-user-plus" />
          <h1 className="passion-one-font">Invite</h1>
        </Button>
      )
    }

    if(game.creator.uid === appState.user.profile.uid) {
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