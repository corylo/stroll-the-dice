import { FormError } from "../../../enums/formError";

export interface IDeleteAccountModalState {
  confirmationText: string;
  confirmationTextError: FormError;
}

export const defaultDeleteAccountModalState = (): IDeleteAccountModalState => ({ 
  confirmationText: "", 
  confirmationTextError: FormError.None 
});