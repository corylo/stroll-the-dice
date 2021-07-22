import { defaultProfileFormStateErrors, IProfileFormStateErrors } from "./profileFormStateErrors";
import { defaultProfileFormStateFields, IProfileFormStateFields } from "./profileFormStateFields";

import { FormStatus } from "../../../enums/formStatus";

export interface IProfileFormState {
  errors: IProfileFormStateErrors;
  fields: IProfileFormStateFields;
  status: FormStatus;
  statusMessage: string;
}

export const defaultProfileFormState = (): IProfileFormState => ({
  errors: defaultProfileFormStateErrors(),
  fields: defaultProfileFormStateFields(),
  status: FormStatus.InProgress,
  statusMessage: ""
});