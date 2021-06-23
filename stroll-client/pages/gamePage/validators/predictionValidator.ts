import { IMatchupSidePredictionState } from "../components/matchupSidePrediction/matchupSidePrediction";

import { FormError } from "../../../enums/formError";

interface IPredictionValidator {
  validate: (funds: number, state: IMatchupSidePredictionState, setState: (state: IMatchupSidePredictionState) => void) => boolean;
}

export const PredictionValidator: IPredictionValidator = {
  validate: (funds: number, state: IMatchupSidePredictionState, setState: (state: IMatchupSidePredictionState) => void): boolean => {
    let errorCount: number = 0;

    if(state.amount === "" || parseInt(state.amount) > funds) {
      setState({ ...state, error: FormError.InvalidValue });
      errorCount++;
    }

    return errorCount === 0;
  }
}