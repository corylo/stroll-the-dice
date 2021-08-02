import { FormError } from "../../../enums/formError";

export interface IGameFormStateErrors {
  duration: FormError;
  gameDays: FormError;
  mode: FormError;
  name: FormError;
  startsAt: FormError;
  startsAtHour: FormError;
}

export const defaultGameFormStateErrors = (): IGameFormStateErrors => ({
  duration: FormError.None,
  gameDays: FormError.None,
  mode: FormError.None,
  name: FormError.None,
  startsAt: FormError.None,
  startsAtHour: FormError.None
});