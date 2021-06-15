import { defaultGameFormStateErrors, IGameFormStateErrors } from "./gameFormStateErrors";
import { defaultGameFormStateFields, IGameFormStateFields } from "./gameFormStateFields";

import { FormStatus } from "../../../enums/formStatus";

export interface IGameFormState {
  errors: IGameFormStateErrors;
  fields: IGameFormStateFields;
  status: FormStatus;
}

export const defaultGameFormState = (): IGameFormState => ({
  errors: defaultGameFormStateErrors(),
  fields: defaultGameFormStateFields(),
  status: FormStatus.InProgress
});