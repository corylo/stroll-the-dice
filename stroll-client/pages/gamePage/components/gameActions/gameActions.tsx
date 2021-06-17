import React, { useContext } from "react";

import { IconButton } from "../../../../components/buttons/iconButton";
import { UpdateGameButton } from "../updateGameButton/updateGameButton";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { IInvite } from "../../../../../stroll-models/invite";
import { IProfile } from "../../../../../stroll-models/profile";

import { AppStatus } from "../../../../enums/appStatus";

interface GameActionsProps {  
  creator: IProfile;
  invite: IInvite;
  toggleInvite: () => void;
  toggleUpdate: () => void;
}

export const GameActions: React.FC<GameActionsProps> = (props: GameActionsProps) => {
  const { appState } = useContext(AppContext);

  const { creator, invite } = props;

  let actions: JSX.Element[] = [];

  if(invite) {    
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

  if(appState.status === AppStatus.SignedIn && creator.uid === appState.user.profile.uid) {
    actions.push(
      <UpdateGameButton 
        key="update"
        creator={creator} 
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

  return null;
}