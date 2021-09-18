import { IAction } from "../../../models/action";
import { IProfileFormState } from "../models/profileFormState";
import { IProfileFormStateErrors } from "../models/profileFormStateErrors";

import { FormError } from "../../../enums/formError";
import { FormStatus } from "../../../enums/formStatus";
import { ProfileFormAction } from "../enums/profileFormAction";

export const profileFormReducer = (state: IProfileFormState, action: IAction): IProfileFormState => {  
  const { errors, fields } = state;

  let updatedErrors: IProfileFormStateErrors = { ...errors };

  switch (action.type) {   
    case ProfileFormAction.SetColor:
      if(errors.color === FormError.MissingValue && action.payload !== "") {
        updatedErrors.color = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          color: action.payload
        },
        errors: updatedErrors
      }
    case ProfileFormAction.SetErrors:
      return {
        ...state,
        errors: action.payload
      }
    case ProfileFormAction.SetIcon:
      if(errors.icon === FormError.MissingValue && action.payload !== "") {
        updatedErrors.icon = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          icon: action.payload
        },
        errors: updatedErrors
      }
    case ProfileFormAction.SetName:
      if(errors.name === FormError.MissingValue && action.payload.trim() !== "") {
        updatedErrors.name = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          name: action.payload
        },
        errors: updatedErrors
      }
    case ProfileFormAction.SetUsername:
      if(errors.username === FormError.MissingValue && action.payload.trim() !== "") {
        updatedErrors.username = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          username: action.payload
        },
        errors: updatedErrors
      } 
    case ProfileFormAction.SetStatus:
      return {
        ...state,
        status: action.payload,
        statusMessage: ""
      }
    case ProfileFormAction.UpdatingProfileTooSoonError:
      return {
        ...state,
        status: FormStatus.SubmitError,
        statusMessage: "Unable to update profile. Please try again later. (Limit once per 10 min)"
      }
    default:
      throw new Error(`Unknown action type in profileFormReducer: ${action.type}`);
  }
}