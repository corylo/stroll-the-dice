import { PaymentItemID } from "../stroll-enums/paymentItemID";

interface IPaymentUtility {
  getPrice: (itemID: PaymentItemID) => number;
}

export const PaymentUtility: IPaymentUtility = {
  getPrice: (itemID: PaymentItemID): number => {
    switch(itemID) {
      case PaymentItemID.OneGameDay:
        return 0.99;
      case PaymentItemID.FiveGameDays:
        return 1.99;
      case PaymentItemID.FourteenGameDays:
        return 4.99;        
      case PaymentItemID.TwentyEightGameDays:
        return 6.99;        
      case PaymentItemID.OneHundredFourtyGameDays:
        return 29.99;
      default:
        throw new Error(`Unknown Payment Item ID: ${itemID}`);
    }
  }
}