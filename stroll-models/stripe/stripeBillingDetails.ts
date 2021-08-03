export interface IStripeBillingAddress {
  city: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
}

export interface IStripeBillingDetails {
  address: IStripeBillingAddress;
  email: string;
  name: string;
}