import { DateUtility } from "../../../../stroll-utilities/dateUtility";

import { IGameFormStateErrors } from "../models/gameFormStateErrors";
import { IGameFormStateFields } from "../models/gameFormStateFields";
import { IUser } from "../../../models/user";

import { FormError } from "../../../enums/formError";
import { GameDuration } from "../../../../stroll-enums/gameDuration";
import { GameFormAction } from "../enums/gameFormAction";
import { GameMode } from "../../../../stroll-enums/gameMode";
import { IGame } from "../../../../stroll-models/game";

interface IGameFormValidator {
  validate: (errors: IGameFormStateErrors, fields: IGameFormStateFields, game: IGame, user: IUser, dispatch: (type: GameFormAction, payload?: any) => void) => boolean;
}

export const GameFormValidator: IGameFormValidator = {
  validate: (errors: IGameFormStateErrors, fields: IGameFormStateFields, game: IGame, user: IUser, dispatch: (type: GameFormAction, payload?: any) => void): boolean => {    
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
    } else if (!DateUtility.withinDaysUpper(30, fields.startsAt)) { 
      errors.startsAt = FormError.UpperDateLimitExceeded;
      errorCount++;
    } else if (!DateUtility.withinDaysLower(-1, fields.startsAt)) {
      errors.startsAt = FormError.LowerDateLimitExceeded;
      errorCount++;
    }

    if(!DateUtility.withinDaysLower(0, fields.startsAt, fields.startsAtHour)) {
      errors.startsAtHour = FormError.LowerDateLimitExceeded;
      errorCount++;
    }

    if(
      game === undefined && 
      fields.duration > 0 && 
      user.stats.gameDays.available < fields.duration
    ) {
      errors.gameDays = FormError.MissingValue;
      errorCount++;
    }

    dispatch(GameFormAction.SetErrors, errors);

    return errorCount === 0;
  }
}