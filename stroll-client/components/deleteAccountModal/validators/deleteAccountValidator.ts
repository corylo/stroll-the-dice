import { IDeleteAccountModalState } from "../models/deleteAccountModalState";

import { DeleteAccountConfirmationText } from "../enums/deleteAccountConfirmationText";
import { FormError } from "../../../enums/formError";

interface IDeleteAccountValidator {
  validate: (state: IDeleteAccountModalState, setState: (state: IDeleteAccountModalState) => void) => boolean;
}

export const DeleteAccountValidator: IDeleteAccountValidator = {
  validate: (state: IDeleteAccountModalState, setState: (state: IDeleteAccountModalState) => void): boolean => {
    let errorCount: number = 0,
      updatedConfirmationTextError: FormError = state.confirmationTextError;

    if(state.confirmationText.toUpperCase() !== DeleteAccountConfirmationText.Value) {
      updatedConfirmationTextError = FormError.InvalidValue;
      errorCount++;
    }

    setState({ ...state, confirmationTextError: updatedConfirmationTextError });

    return errorCount === 0;
  }
}