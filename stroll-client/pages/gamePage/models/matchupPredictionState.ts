import { FormError } from "../../../enums/formError";
import { FormStatus } from "../../../enums/formStatus";

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
  playerID: string;  
  status: FormStatus;
}

export const defaultMatchupPredictionState = (): IMatchupPredictionState => ({
  amount: "",
  errors: defaultMatchupPredictionStateErrors(),
  playerID: "",
  status: FormStatus.InProgress
});
