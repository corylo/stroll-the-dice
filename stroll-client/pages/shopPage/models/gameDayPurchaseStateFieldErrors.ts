import { FormError } from "../../../enums/formError";

export interface IGameDayPurchaseStateFieldErrors {
  card: FormError;
  city: FormError;
  email: FormError;
  line1: FormError;
  line2: FormError;  
  name: FormError;
  quantity: FormError;
  state: FormError;
  zip: FormError;
}

export const defaultGameDayPurchaseStateFieldErrors = (): IGameDayPurchaseStateFieldErrors => ({
  card: FormError.None,
  city: FormError.None,
  email: FormError.None,
  line1: FormError.None,
  line2: FormError.None,
  name: FormError.None,
  quantity: FormError.None,
  state: FormError.None,
  zip: FormError.None
});
