import { FormError } from "../../../enums/formError";

export interface IGameFormStateErrors {
  duration: FormError;
  mode: FormError;
  name: FormError;
  startsAt: FormError;
  startsAtHour: FormError;
}

export const defaultGameFormStateErrors = (): IGameFormStateErrors => ({
  duration: FormError.None,
  mode: FormError.None,
  name: FormError.None,
  startsAt: FormError.None,
  startsAtHour: FormError.None
});