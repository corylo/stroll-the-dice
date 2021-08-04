import { useEffect } from "react";

import { IGameDayPurchaseState } from "../../../models/gameDayPurchaseState";

import { FormError } from "../../../../../enums/formError";

export const useGameDayPaymentFormErrorListener = (state: IGameDayPurchaseState, setState: (state: IGameDayPurchaseState) => void): void => {
  const { errors, fields } = state;

  useEffect(() => {
    const updates: IGameDayPurchaseState = { ...state };

    if(errors.name === FormError.MissingValue && fields.billing.name.trim() !== "") {
      updates.errors.name = FormError.None;
    }

    if(errors.email === FormError.MissingValue && fields.billing.email.trim() !== "") {
      updates.errors.email = FormError.None;
    }

    if(errors.line1 === FormError.MissingValue && fields.billing.address.line1.trim() !== "") {
      updates.errors.line1 = FormError.None;
    }

    if(errors.city === FormError.MissingValue && fields.billing.address.city.trim() !== "") {
      updates.errors.city = FormError.None;
    }

    if(errors.state === FormError.MissingValue && fields.billing.address.state.trim() !== "") {
      updates.errors.state = FormError.None;
    }

    if(errors.zip === FormError.MissingValue && fields.billing.address.zip.trim() !== "") {
      updates.errors.zip = FormError.None;
    }

    if(errors.card === FormError.InvalidValue && fields.card === true) {
      updates.errors.card = FormError.None;
    }

    setState(updates);
  }, [fields]);
}