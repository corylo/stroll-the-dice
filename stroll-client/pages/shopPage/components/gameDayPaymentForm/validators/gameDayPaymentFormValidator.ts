import { IGameDayPurchaseState } from "../../../models/gameDayPurchaseState";

import { FormError } from "../../../../../enums/formError";

interface IGameDayPaymentFormValidator {
  validate: (state: IGameDayPurchaseState, setState: (state: IGameDayPurchaseState) => void) => boolean;
}

export const GameDayPaymentFormValidator: IGameDayPaymentFormValidator = {
  validate: (state: IGameDayPurchaseState, setState: (state: IGameDayPurchaseState) => void): boolean => {
    const { fields, errors } = state;

    let errorCount: number = 0;

    if(fields.billing.name.trim() === "") {
      errors.name = FormError.MissingValue;
      errorCount++;
    }

    if(fields.billing.email.trim() === "") {
      errors.email = FormError.MissingValue;
      errorCount++;
    }

    if(fields.billing.address.line1.trim() === "") {
      errors.line1 = FormError.MissingValue;
      errorCount++;
    }

    if(fields.billing.address.city.trim() === "") {
      errors.city = FormError.MissingValue;
      errorCount++;
    }

    if(fields.billing.address.state.trim() === "") {
      errors.state = FormError.MissingValue;
      errorCount++;
    }

    if(fields.billing.address.zip.trim() === "") {
      errors.zip = FormError.MissingValue;
      errorCount++;
    }

    if(fields.card === false) {
      errors.card = FormError.InvalidValue;
      errorCount++;
    }

    setState({ ...state, errors });

    return errorCount === 0;
  }
}