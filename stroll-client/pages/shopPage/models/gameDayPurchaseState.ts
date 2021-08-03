import { defaultPaymentBillingFields, IPaymentBillingFields } from "../../../../stroll-models/paymentBillingFields";

import { FormError } from "../../../enums/formError";
import { FormStatus } from "../../../enums/formStatus";

export interface IGameDayPurchaseStateFields {
  billing: IPaymentBillingFields;
  quantity: number;
}

export const defaultGameDayPurchaseStateFields = (): IGameDayPurchaseStateFields => ({
  billing: defaultPaymentBillingFields(),
  quantity: 1
});

export interface IGameDayPurchaseStateBillingAddressFieldErrors {
  city: FormError;
  line1: FormError;
  line2: FormError;  
  state: FormError;
  zip: FormError;
}

export const defaultGameDayPurchaseStateBillingAddressFieldErrors = (): IGameDayPurchaseStateBillingAddressFieldErrors => ({  
  city: FormError.None,
  line1: FormError.None,
  line2: FormError.None,
  state: FormError.None,
  zip: FormError.None
});

export interface IGameDayPurchaseStateBillingFieldErrors {
  address: IGameDayPurchaseStateBillingAddressFieldErrors;
  email: FormError;
  name: FormError;
}

export const defaultGameDayPurchaseStateBillingFieldErrors = (): IGameDayPurchaseStateBillingFieldErrors => ({  
  address: defaultGameDayPurchaseStateBillingAddressFieldErrors(),
  email: FormError.None,
  name: FormError.None
});

export interface IGameDayPurchaseStateFieldErrors {
  billing: IGameDayPurchaseStateBillingFieldErrors;
  quantity: FormError;
}

export const defaultGameDayPurchaseStateFieldErrors = (): IGameDayPurchaseStateFieldErrors => ({
  billing: defaultGameDayPurchaseStateBillingFieldErrors(),
  quantity: FormError.None
});

export interface IGameDayPurchaseState {
  errors: IGameDayPurchaseStateFieldErrors;
  fields: IGameDayPurchaseStateFields;
  status: FormStatus;
}

export const defaultGameDayPurchaseState = (): IGameDayPurchaseState => ({  
  errors: defaultGameDayPurchaseStateFieldErrors(),
  fields: defaultGameDayPurchaseStateFields(),
  status: FormStatus.InProgress
});