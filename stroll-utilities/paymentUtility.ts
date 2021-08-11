import { PaymentItemID } from "../stroll-enums/paymentItemID";
import { StrollTheDiceCDN } from "../stroll-enums/strollTheDiceCDN";

interface IPaymentUtility {
  getImage: (itemID: PaymentItemID) => string;
  getItemID: (itemID: string) => PaymentItemID;
  getPrice: (itemID: PaymentItemID) => number; 
}

export const PaymentUtility: IPaymentUtility = {
  getImage: (itemID: PaymentItemID): string => {
    switch(itemID) {
      case PaymentItemID.TwoGameDays:
        return `${StrollTheDiceCDN.Url}/img/graphics/ticket.png`;
      case PaymentItemID.FiveGameDays:
        return `${StrollTheDiceCDN.Url}/img/graphics/bag.png`;
      case PaymentItemID.FourteenGameDays:
        return `${StrollTheDiceCDN.Url}/img/graphics/box.png`;
      case PaymentItemID.TwentyEightGameDays:
        return `${StrollTheDiceCDN.Url}/img/graphics/treasure-chest.png`;
      case PaymentItemID.OneHundredFourtyGameDays:
        return `${StrollTheDiceCDN.Url}/img/graphics/airdrop.png`;
      default:
        throw new Error(`Unknown Payment Item ID: ${itemID}`);
    }
  },
  getItemID: (itemID: string): PaymentItemID => {
    switch(itemID) {
      case PaymentItemID.TwoGameDays:
        return PaymentItemID.TwoGameDays;
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
      case PaymentItemID.TwoGameDays:
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