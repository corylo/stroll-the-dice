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

interface UpdateProfileModalProps {  
  
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = (props: UpdateProfileModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, toggles, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const cancel = (): void => { 
    if(user.profile.username !== "") {
      dispatch(AppAction.ToggleUpdateProfile, false)
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
      if(user.profile.username === "") {        
        const profile: IProfile = ProfileFormUtility.mapCreate(fields, user);

        await ProfileService.create(profile);

        dispatch(AppAction.SetProfile, profile);
      } else {
        const update: IProfileUpdate = ProfileFormUtility.mapUpdate(fields);

        await ProfileService.update(user.profile.uid, update);

        dispatch(AppAction.SetProfile, { ...user.profile, ...update });
      }
    }


    const getTitle = (): JSX.Element => {
      if(user.profile.username === "") {
        return (
          <ModalTitle text="Update Your Profile" />
        )
      }
  
      return (
        <ModalTitle text="Update Your Profile" handleOnClose={cancel} />
      )
    }
  
    return (
      <Modal id="update-profile-modal" status={statuses.profile.is} priority>
        {getTitle()}
        <ModalBody>   
          <ProfileForm profile={user.profile} done={cancel} save={save} />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}