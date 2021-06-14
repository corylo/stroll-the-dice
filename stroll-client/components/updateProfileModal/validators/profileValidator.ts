import { IProfileFormStateErrors } from "../models/profileFormStateErrors";
import { IProfileFormStateFields } from "../models/profileFormStateFields";

import { FormError } from "../../../enums/formError";
import { ProfileFormAction } from "../enums/profileFormAction";

interface IProfileValidator {
  validate: (errors: IProfileFormStateErrors, fields: IProfileFormStateFields, dispatch: (type: ProfileFormAction, payload?: any) => void) => boolean;
}

export const ProfileValidator: IProfileValidator = {
  validate: (errors: IProfileFormStateErrors, fields: IProfileFormStateFields, dispatch: (type: ProfileFormAction, payload?: any) => void): boolean => {    
    let errorCount: number = 0;

    if(fields.color === "") {
      errors.color = FormError.MissingValue;
      errorCount++;
    }    
    
    if(fields.icon === "") {
      errors.icon = FormError.MissingValue;
      errorCount++;
    }

    if(fields.username.trim() === "") {
      errors.username = FormError.MissingValue;
      errorCount++;
    }

    dispatch(ProfileFormAction.SetErrors, errors);
    
    return errorCount === 0;
  }
}