import React, { useContext } from "react";

import { CopyButton } from "../../../../components/copyButton/copyButton";
import { TooltipSide } from "../../../../components/tooltip/tooltip";
import { UpdateGameButton } from "../updateGameButton/updateGameButton";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { InviteUtility } from "../../../../utilities/inviteUtility";

import { IInvite } from "../../../../../stroll-models/invite";
import { IProfile } from "../../../../../stroll-models/profile";

import { AppStatus } from "../../../../enums/appStatus";

interface GameActionsProps {  
  creator: IProfile;
  invite: IInvite;
  toggle: () => void;
}

export const GameActions: React.FC<GameActionsProps> = (props: GameActionsProps) => {
  const { appState } = useContext(AppContext);

  const { creator, invite } = props;

  let actions: JSX.Element[] = [];

  if(invite) {
    actions.push(
      <CopyButton
        key="copy"
        icon="fal fa-link"
        tooltip="Invite"
        tooltipSide={TooltipSide.BottomLeft}
        value={InviteUtility.getLink(invite)}
      />
    )
  }

  if(appState.status === AppStatus.SignedIn && creator.uid === appState.user.profile.uid) {
    actions.push(
      <UpdateGameButton 
        key="update"
        creator={creator} 
        toggle={props.toggle} 
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