import React, { useEffect, useReducer } from "react";

import { Button } from "../../../buttons/button";
import { ColorSelector } from "../colorSelector/colorSelector";
import { Form } from "../../../form/form";
import { FormActions } from "../../../form/formActions";
import { FormBody } from "../../../form/formBody";
import { IconSelector } from "../iconSelector/iconSelector";
import { InputWrapper } from "../../../inputWrapper/inputWrapper";
import { ProfileIcon } from "../../../profileIcon/profileIcon";

import { profileFormReducer } from "../../reducers/profileFormReducer";

import { ProfileValidator } from "../../validators/profileValidator";

import { DomUtility } from "../../../../utilities/domUtility";
import { ProfileFormUtility } from "../../utilities/profileFormUtility";

import { IProfile } from "../../../../../stroll-models/profile";
import { IProfileFormStateFields } from "../../models/profileFormStateFields";

import { Color } from "../../../../../stroll-enums/color";
import { ElementID } from "../../../../enums/elementId";
import { FirebaseErrorCode } from "../../../../../stroll-enums/firebaseErrorCode";
import { FormStatus } from "../../../../enums/formStatus";
import { Icon } from "../../../../../stroll-enums/icon";
import { ProfileFormAction } from "../../enums/profileFormAction";

interface ProfileFormProps {  
  leaveOnSave?: boolean;
  profile?: IProfile;  
  back: () => void;
  save: (fields: IProfileFormStateFields) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = (props: ProfileFormProps) => {  
  const [profileFormState, dispatchToProfileForm] = useReducer(profileFormReducer, ProfileFormUtility.mapInitialState(props.profile));

  const { errors, fields, status } = profileFormState;

  const dispatch = (type: ProfileFormAction, payload?: any): void => dispatchToProfileForm({ type, payload });

  useEffect(() => {
    if(status !== FormStatus.InProgress && ProfileFormUtility.hasChanged(props.profile, fields)) {
      dispatch(ProfileFormAction.SetStatus, FormStatus.InProgress);
    }
  }, [fields]);

  const save = async (): Promise<void> => {
    if(profileFormState.status !== FormStatus.Submitting && ProfileValidator.validate(errors, fields, dispatch)) {
      try {
        dispatch(ProfileFormAction.SetStatus, FormStatus.Submitting);

        await props.save(fields);

        if(!props.leaveOnSave) {
          dispatch(ProfileFormAction.SetStatus, FormStatus.SubmitSuccess);
        }
      } catch (err) {
        console.error(err);

        if(props.profile.id !== "" && err.code === FirebaseErrorCode.PermissionDenied) {
          dispatch(ProfileFormAction.UpdatingProfileTooSoonError);
        } else {
          dispatch(ProfileFormAction.SetStatus, FormStatus.SubmitError);
        }
      }

      DomUtility.scrollToBottom(ElementID.UpdateProfileModal);
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      save();
    }
  }

  const getStatusMessage = (): string => {
    if(profileFormState.status === FormStatus.SubmitSuccess) {
      return "Profile saved successfully!";
    } else if(profileFormState.status === FormStatus.SubmitError) {
      return profileFormState.statusMessage || "There was an issue saving your profile. Please refresh and try again!";        
    }
  }

  const getSaveButton = (): JSX.Element => {
    if(ProfileFormUtility.hasChanged(props.profile, fields)) {
      return (      
        <Button
          className="submit-button fancy-button passion-one-font" 
          handleOnClick={save}
        >
          Save
        </Button>
      )
    }
  }
  
  return (    
    <Form     
      errors={errors}
      id="profile-form"
      status={profileFormState.status}
      statusMessage={getStatusMessage()}
    >
      <FormBody>
        <InputWrapper
          id="username-input" 
          label="Username" 
          minLength={3}
          maxLength={24}
          value={fields.username}
          error={errors.username}
        >
          <input 
            type="text"
            className="passion-one-font"
            minLength={3}
            maxLength={24}
            placeholder="Flying Ninja Monkey"
            value={fields.username}
            onChange={(e: any) => dispatch(ProfileFormAction.SetUsername, e.target.value.replace(/[^a-z0-9 ]/gi, ""))}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
        <InputWrapper
          id="name-input" 
          label="Name" 
          maxLength={100}
          value={fields.name}
          error={errors.name}
        >
          <input 
            type="text"
            className="passion-one-font"
            maxLength={100}
            placeholder="Name"
            value={fields.name}
            onChange={(e: any) => dispatch(ProfileFormAction.SetName, e.target.value.replace(/[^a-z0-9 ]/gi, ""))}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
        <div className="profile-icon-preview" style={{ backgroundColor: `rgba(${fields.color}, 0.1)` }}>
          <ProfileIcon 
            color={fields.color}
            icon={fields.icon}
          />
        </div>
        <InputWrapper
          label="Color"
          error={errors.color}
          errorMessage="Required"
        >
          <ColorSelector 
            selected={fields.color}
            select={(color: Color) => dispatch(ProfileFormAction.SetColor, color)} 
          />
        </InputWrapper>
        <InputWrapper
          label="Icon"
          error={errors.icon}
          errorMessage="Required"
        >
          <IconSelector 
            color={fields.color}
            selected={fields.icon}
            select={(icon: Icon) => dispatch(ProfileFormAction.SetIcon, icon)} 
          />
        </InputWrapper>
      </FormBody>   
      <FormActions>
        {getSaveButton()}
      </FormActions>
    </Form>
  );
}