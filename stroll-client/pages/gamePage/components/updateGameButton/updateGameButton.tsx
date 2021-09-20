import React, { useContext } from "react";

import { IconButton } from "../../../../components/buttons/iconButton";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { AppStatus } from "../../../../enums/appStatus";

interface UpdateGameButtonProps {  
  creatorUID: string;
  toggle: () => void;
}

export const UpdateGameButton: React.FC<UpdateGameButtonProps> = (props: UpdateGameButtonProps) => {  
  const { appState } = useContext(AppContext);

  const { creatorUID, toggle } = props;

  if(appState.status === AppStatus.SignedIn && creatorUID === appState.user.profile.uid) {
    return (
      <IconButton
        className="game-action-button"
        icon="fal fa-pen" 
        tooltip="Update"
        handleOnClick={toggle} 
      />
    )
  }

  return null;
}