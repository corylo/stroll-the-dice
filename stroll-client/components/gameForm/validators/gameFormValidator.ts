import { DateUtility } from "../../../../stroll-utilities/dateUtility";

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
    
    if(!DateUtility.valid(fields.startsAt)) {
      errors.startsAt = FormError.InvalidValue;
      errorCount++;
    } else if (!DateUtility.withinDaysUpper(fields.startsAt, 30)) {
      errors.startsAt = FormError.UpperDateLimitExceeded;
      errorCount++;
    } else if (!DateUtility.withinDaysLower(fields.startsAt, 0)) {
      errors.startsAt = FormError.LowerDateLimitExceeded;
      errorCount++;
    }

    dispatch(GameFormAction.SetErrors, errors);

    return errorCount === 0;
  }
}