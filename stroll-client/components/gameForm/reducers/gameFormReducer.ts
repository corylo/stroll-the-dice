import { IAction } from "../../../models/action";
import { IGameFormState } from "../models/gameFormState";
import { IGameFormStateErrors } from "../models/gameFormStateErrors";

import { FormError } from "../../../enums/formError";
import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameFormAction } from "../enums/gameFormAction";
import { GameMode } from "../../../../stroll-enums/gameMode";

export const gameFormReducer = (state: IGameFormState, action: IAction): IGameFormState => {  
  const { errors, fields } = state;

  let updatedErrors: IGameFormStateErrors = { ...errors };

  switch (action.type) {  
    case GameFormAction.SetDuration:
      if(errors.duration === FormError.MissingValue && action.payload !== GameDuration.None) {
        updatedErrors.duration = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          duration: action.payload
        },
        errors: updatedErrors
      } 
    case GameFormAction.SetMode:
      if(errors.mode === FormError.MissingValue && action.payload !== GameMode.None) {
        updatedErrors.mode = FormError.None;
      }

      return {
        ...state,
        fields: {
          ...fields,
          mode: action.payload
        },
        errors: updatedErrors
      } 
    case GameFormAction.SetErrors:
      return {
        ...state,
        errors: action.payload
      }
    case GameFormAction.SetDuration:

    case GameFormAction.SetName:
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
    case GameFormAction.SetStatus:
      return {
        ...state,
        status: action.payload
      }
    default:
      throw new Error(`Unknown action type in gameFormReducer: ${action.type}`);
  }
}