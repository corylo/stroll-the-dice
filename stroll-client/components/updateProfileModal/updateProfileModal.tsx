import React, { useContext } from "react";

import { Modal } from "../modal/modal";
import { ModalBody } from "../modal/modalBody";
import { ModalTitle } from "../modal/modalTitle";
import { ProfileForm } from "./components/profileForm/profileForm";

import { AppContext } from "../app/contexts/appContext";

import { ProfileService } from "../../services/profileService";

import { ProfileFormUtility } from "./utilities/profileFormUtility";

import { useOnClickAwayEffect } from "../../effects/appEffects";

import { IProfile } from "../../../stroll-models/profile";
import { IProfileFormStateFields } from "./models/profileFormStateFields";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

import { AppAction } from "../../enums/appAction";
import { ElementID } from "../../enums/elementId";

interface UpdateProfileModalProps {  
  
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = (props: UpdateProfileModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, toggles, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const cancel = (): any => { 
    if(user.profile.username !== "") {
      return () => dispatch(AppAction.ToggleUpdateProfile, false);
    }
  };  

  useOnClickAwayEffect(
    toggles.profile, 
    ["update-profile-modal-content"], 
    [toggles.profile, appState.statuses.profile.is], 
    cancel
  );

  if(toggles.profile) {    
    const save = async (fields: IProfileFormStateFields): Promise<void> => {    
      const update: IProfileUpdate = ProfileFormUtility.mapUpdate(fields);

      await ProfileService.update(user.profile.uid, update);

      const profile: IProfile = {
        ...user.profile,
        ...update
      }

      dispatch(AppAction.SetProfile, profile);
    }


    const getTitle = (): JSX.Element => {
      if(user.profile.username === "") {
        const getText = (): string => {
          if(toggles.acceptInvite) {
            return "Create Your Profile Before Continuing";
          }

          return "Create Your Profile";
        }

        return (
          <ModalTitle text={getText()} />
        )
      }
  
      return (
        <ModalTitle text="Update Your Profile" handleOnClose={cancel()} />
      )
    }
  
    return (
      <Modal id={ElementID.UpdateProfileModal} status={statuses.profile.is} priority>
        {getTitle()}
        <ModalBody>   
          <ProfileForm 
            leaveOnSave={toggles.acceptInvite}
            profile={user.profile} 
            back={cancel()} 
            save={save} 
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}