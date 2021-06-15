import { IGameFormStateErrors } from "../models/gameFormStateErrors";
import { IGameFormStateFields } from "../models/gameFormStateFields";

import { FormError } from "../../../enums/formError";
import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameFormAction } from "../enums/gameFormAction";
import { GameMode } from "../../../../stroll-enums/gameMode";

interface IGameFormValidator {
  validate: (errors: IGameFormStateErrors, fields: IGameFormStateFields, dispatch: (type: GameFormAction, payload?: any) => void) => boolean;
}

export const GameFormValidator: IGameFormValidator = {
  validate: (errors: IGameFormStateErrors, fields: IGameFormStateFields, dispatch: (type: GameFormAction, payload?: any) => void): boolean => {    
    let errorCount: number = 0;

    if(fields.name.trim() === "") {
      errors.name = FormError.MissingValue;
      errorCount++;
    }    

    if(fields.duration === GameDuration.None) {
      errors.duration = FormError.MissingValue;
      errorCount++;
    }

    if(fields.mode === GameMode.None) {
      errors.mode = FormError.MissingValue;
      errorCount++;
    }

    dispatch(GameFormAction.SetErrors, errors);

    return errorCount === 0;
  }
}