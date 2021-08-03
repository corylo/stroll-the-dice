import { PaymentItemID } from "../stroll-enums/paymentItemID";

interface IPaymentUtility {
  getItemID: (itemID: string) => PaymentItemID;
  getPrice: (itemID: PaymentItemID) => number; 
}

export const PaymentUtility: IPaymentUtility = {
  getItemID: (itemID: string): PaymentItemID => {
    switch(itemID) {
      case PaymentItemID.OneGameDay:
        return PaymentItemID.OneGameDay;
      case PaymentItemID.FiveGameDays:
        return PaymentItemID.FiveGameDays;
      case PaymentItemID.FourteenGameDays:
        return PaymentItemID.FourteenGameDays;        
      case PaymentItemID.TwentyEightGameDays:
        return PaymentItemID.TwentyEightGameDays;        
      case PaymentItemID.OneHundredFourtyGameDays:
        return PaymentItemID.OneHundredFourtyGameDays;
      default:
        throw new Error(`Unknown Payment Item ID: ${itemID}`);
    }
  },
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