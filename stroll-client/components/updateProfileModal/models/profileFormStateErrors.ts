import { FormError } from "../../../enums/formError";

export interface IProfileFormStateErrors {
  color: FormError;
  icon: FormError;
  name: FormError;
  username: FormError;
}

export const defaultProfileFormStateErrors = (): IProfileFormStateErrors => ({
  color: FormError.None,
  icon: FormError.None,
  name: FormError.None,
  username: FormError.None
});