import React, { useContext } from "react";

import { Button } from "../../../../components/buttons/button";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { AppAction } from "../../../../enums/appAction";
import { Icon } from "../../../../../stroll-enums/icon";

interface ActionCenterSectionProps {  
  
}

export const ActionCenterSection: React.FC<ActionCenterSectionProps> = (props: ActionCenterSectionProps) => {  
  const { dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  return (
    <ProfilePageSection className="action-center-section" icon={Icon.User} title="Action Center">
      <Button
        className="action-center-button fancy-button"
        handleOnClick={() => dispatch(AppAction.ToggleUpdateProfile, true)} 
      >
        <i className="fal fa-pencil" />
        <h1 className="passion-one-font">Edit Profile</h1>
      </Button>
      <Button
        className="action-center-button fancy-button red"
        handleOnClick={() => dispatch(AppAction.ToggleDeleteAccount, true)} 
      >
        <i className="far fa-trash-alt" />
        <h1 className="passion-one-font">Delete Account Forever</h1>
      </Button>
    </ProfilePageSection>
  );
}