import React, { useContext } from "react";

import { Dot } from "../../../../components/dot/dot";
import { IconButton } from "../../../../components/buttons/iconButton";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { IProfile } from "../../../../../stroll-models/profile";

import { AppStatus } from "../../../../enums/appStatus";

interface UpdateGameButtonProps {  
  creator: IProfile;
  toggle: () => void;
}

export const UpdateGameButton: React.FC<UpdateGameButtonProps> = (props: UpdateGameButtonProps) => {  
  const { appState } = useContext(AppContext);

  const { creator, toggle } = props;

  if(appState.status === AppStatus.SignedIn && creator.uid === appState.user.profile.uid) {
    return (
      <React.Fragment>
        <Dot />
        <IconButton
          className="update-game-button inline-icon-button"
          icon="fal fa-pen" 
          tooltip="Update"
          handleOnClick={toggle} 
        />
      </React.Fragment>
    )
  }

  return null;
}