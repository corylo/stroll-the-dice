import { IMatchupSidePredictionState } from "../components/matchupSidePrediction/matchupSidePrediction";

import { FormError } from "../../../enums/formError";

interface IPredictionValidator {
  validate: (points: number, state: IMatchupSidePredictionState, setState: (state: IMatchupSidePredictionState) => void) => boolean;
}

export const PredictionValidator: IPredictionValidator = {
  validate: (points: number, state: IMatchupSidePredictionState, setState: (state: IMatchupSidePredictionState) => void): boolean => {
    let errorCount: number = 0;

    const amount: number = state.amount !== ""
      ? parseInt(state.amount)
      : 0;

    if(amount === 0 || amount > points) {
      setState({ ...state, error: FormError.InvalidValue });
      errorCount++;
    }

    return errorCount === 0;
  }
}