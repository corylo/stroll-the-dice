import { defaultGameDayPurchaseStateFieldErrors, IGameDayPurchaseStateFieldErrors } from "./gameDayPurchaseStateFieldErrors";
import { defaultGameDayPurchaseStateFields, IGameDayPurchaseStateFields } from "./gameDayPurchaseStateFields";

import { FormStatus } from "../../../enums/formStatus";

export interface IGameDayPurchaseState {
  errors: IGameDayPurchaseStateFieldErrors;
  fields: IGameDayPurchaseStateFields;
  status: FormStatus;
}

export const defaultGameDayPurchaseState = (): IGameDayPurchaseState => ({  
  errors: defaultGameDayPurchaseStateFieldErrors(),
  fields: defaultGameDayPurchaseStateFields(),
  status: FormStatus.InProgress
});