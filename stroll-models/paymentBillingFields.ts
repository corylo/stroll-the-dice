export interface IPaymentBillingAddress {
  city: string;
  line1: string;
  line2: string;  
  state: string;
  zip: string;
}

export const defaultPaymentBillingAddress = (): IPaymentBillingAddress => ({
  city: "",
  line1: "",
  line2: "",
  state: "",
  zip: ""
});

export interface IPaymentBillingFields {
  address: IPaymentBillingAddress;
  email: string;
  name: string;
}

export const defaultPaymentBillingFields = (): IPaymentBillingFields => ({
  address: defaultPaymentBillingAddress(),
  email: "",
  name: ""
});