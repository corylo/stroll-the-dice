import { FormError } from "../../../enums/formError";
import { FormStatus } from "../../../enums/formStatus";
import { PredictionConstraint } from "../../../../stroll-enums/predictionConstraint";

export interface IMatchupPredictionStateErrors {
  amount: FormError;
  playerID: FormError;
}

export const defaultMatchupPredictionStateErrors = (): IMatchupPredictionStateErrors => ({
  amount: FormError.None,
  playerID: FormError.None
});

export interface IMatchupPredictionState {
  amount: string;
  errors: IMatchupPredictionStateErrors;
  minimum: number;
  playerID: string;  
  status: FormStatus;
}

export const defaultMatchupPredictionState = (): IMatchupPredictionState => ({
  amount: "",
  errors: defaultMatchupPredictionStateErrors(),
  minimum: PredictionConstraint.CreationMinimum,
  playerID: "",
  status: FormStatus.InProgress
});
