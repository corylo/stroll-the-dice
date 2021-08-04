import { defaultPaymentBillingFields, IPaymentBillingFields } from "../../../../stroll-models/paymentBillingFields";

export interface IGameDayPurchaseStateFields {
  billing: IPaymentBillingFields;
  card: boolean;
  quantity: number;
}

export const defaultGameDayPurchaseStateFields = (): IGameDayPurchaseStateFields => ({
  billing: defaultPaymentBillingFields(),
  card: false,
  quantity: 1
});
