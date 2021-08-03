import { PaymentItemID } from "../stroll-enums/paymentItemID";

export interface ICreatePaymentRequest {
  itemID: PaymentItemID;
  quantity: number;
}