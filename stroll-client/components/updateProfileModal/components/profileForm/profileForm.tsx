import React, { useEffect, useReducer } from "react";

import { Button } from "../../../buttons/button";
import { ColorSelector } from "../colorSelector/colorSelector";
import { Form } from "../../../form/form";
import { FormActions } from "../../../form/formActions";
import { FormBody } from "../../../form/formBody";
import { IconSelector } from "../iconSelector/iconSelector";
import { InputWrapper } from "../../../inputWrapper/inputWrapper";

import { profileFormReducer } from "../../reducers/profileFormReducer";

import { ProfileValidator } from "../../validators/profileValidator";

import { ProfileFormUtility } from "../../utilities/profileFormUtility";

import { IProfile } from "../../../../../stroll-models/profile";
import { IProfileFormStateFields } from "../../models/profileFormStateFields";

import { Color } from "../../../../../stroll-enums/color";
import { FormStatus } from "../../../../enums/formStatus";
import { Icon } from "../../../../../stroll-enums/icon";
import { ProfileFormAction } from "../../enums/profileFormAction";

interface ProfileFormProps {  
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

        dispatch(ProfileFormAction.SetStatus, FormStatus.SubmitSuccess);
      } catch (err) {
        console.error(err);

        dispatch(ProfileFormAction.SetStatus, FormStatus.SubmitError);
      }
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
      return "There was an issue saving your profile. Please refresh and try again!";
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

  const getBackButton = (): JSX.Element => {
    if(props.profile && props.profile.username !== "") {
      return (        
        <Button
          className="submit-button fancy-button white passion-one-font" 
          handleOnClick={props.back}
        >
          Back
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
          label="Color"
          error={errors.color}
        >
          <ColorSelector 
            selected={fields.color}
            select={(color: Color) => dispatch(ProfileFormAction.SetColor, color)} 
          />
        </InputWrapper>
        <InputWrapper
          label="Icon"
          error={errors.icon}
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
        {getBackButton()}
      </FormActions>
    </Form>
  );
}