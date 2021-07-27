import React, { useContext } from "react";

import { Modal } from "../modal/modal";
import { ModalBody } from "../modal/modalBody";
import { ModalTitle } from "../modal/modalTitle";
import { ProfileForm } from "./components/profileForm/profileForm";

import { AppContext } from "../app/contexts/appContext";

import { ProfileService } from "../../services/profileService";
import { UpdateProfileService } from "./services/updateProfileService";

import { ProfileFormUtility } from "./utilities/profileFormUtility";
import { ProfileStatsUtility } from "../../utilities/profileStatsUtility";

import { useOnClickAwayEffect } from "../../effects/appEffects";

import { IProfile } from "../../../stroll-models/profile";
import { IProfileFormStateFields } from "./models/profileFormStateFields";
import { IProfileGamePassStats } from "../../../stroll-models/profileStats";
import { IProfileUpdate } from "../../../stroll-models/profileUpdate";

import { AppAction } from "../../enums/appAction";
import { ElementID } from "../../enums/elementId";
import { ProfileStatsID } from "../../../stroll-enums/profileStatsID";

interface UpdateProfileModalProps {  
  
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = (props: UpdateProfileModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, toggles, user } = appState;
  
  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const cancel = (): void => { 
    if(user.profile.username !== "") {
      dispatch(AppAction.ToggleUpdateProfile, false);
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
        const profile: IProfile = ProfileFormUtility.mapCreate(fields, user),
          stats: IProfileGamePassStats = ProfileStatsUtility.mapCreate(ProfileStatsID.GamePass);

        await UpdateProfileService.createProfile(profile, ProfileStatsID.GamePass, stats);

        const action: AppAction = toggles.acceptInvite 
          ? AppAction.SetProfileAndClose 
          : AppAction.SetProfile;

        dispatch(action, { profile, stats });
      } else {
        const update: IProfileUpdate = ProfileFormUtility.mapUpdate(fields);

        await ProfileService.update(user.profile.uid, update);

        dispatch(AppAction.SetProfile, { 
          profile: { ...user.profile, ...update }
        });
      }
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
        <ModalTitle text="Update Your Profile" handleOnClose={cancel} />
      )
    }
  
    return (
      <Modal id={ElementID.UpdateProfileModal} status={statuses.profile.is} priority>
        {getTitle()}
        <ModalBody>   
          <ProfileForm 
            leaveOnSave={toggles.acceptInvite}
            profile={user.profile} 
            back={cancel} 
            save={save} 
          />
        </ModalBody>
      </Modal>
    );
  }

  return null;
}