import { FormError } from "../../../enums/formError";

export interface IGameFormStateErrors {
  name: FormError;
}

export const defaultGameFormStateErrors = (): IGameFormStateErrors => ({
  name: FormError.None
});