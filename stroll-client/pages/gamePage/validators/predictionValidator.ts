import { IMatchupPredictionState, IMatchupPredictionStateErrors } from "../models/matchupPredictionState";

import { FormError } from "../../../enums/formError";

interface IPredictionValidator {
  validate: (points: number, state: IMatchupPredictionState, updateErrors: (errors: IMatchupPredictionStateErrors) => void) => boolean;
}

export const PredictionValidator: IPredictionValidator = {
  validate: (points: number, state: IMatchupPredictionState, updateErrors: (errors: IMatchupPredictionStateErrors) => void): boolean => {
    let errorCount: number = 0,
      updatedErrors: IMatchupPredictionStateErrors = { ...state.errors };

    const amount: number = state.amount !== ""
      ? parseInt(state.amount)
      : 0;

    if(amount > points) {      
      updatedErrors.amount = FormError.UpperLimitExceeded;
      errorCount++;
    } else if(amount < state.minimum) {
      updatedErrors.amount = FormError.LowerLimitExceeded;
      errorCount++;
    }

    if(state.playerID === "") {
      updatedErrors.playerID = FormError.MissingValue;
      errorCount++;
    }

    updateErrors(updatedErrors);

    return errorCount === 0;
  }
}