import { PaymentItemID } from "../stroll-enums/paymentItemID";
import { PaymentItemUrlID } from "../stroll-enums/paymentItemUrlID";
import { StrollTheDiceCDN } from "../stroll-enums/strollTheDiceCDN";

interface IPaymentUtility {
  getImage: (itemID: PaymentItemID) => string;
  getItemID: (itemID: string) => PaymentItemID;
  getItemIDFromItemUrlID: (itemUrlID: PaymentItemUrlID) => PaymentItemID;
  getItemUrlID: (itemID: PaymentItemID) => PaymentItemUrlID;
  getItemUrlIDFromParam: (itemUrlID: string) => PaymentItemUrlID;
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
  getItemIDFromItemUrlID: (itemUrlID: PaymentItemUrlID): PaymentItemID => {
    switch(itemUrlID) {
      case PaymentItemUrlID.TwoGameDays:
        return PaymentItemID.TwoGameDays;
      case PaymentItemUrlID.FiveGameDays:
        return PaymentItemID.FiveGameDays;
      case PaymentItemUrlID.FourteenGameDays:
        return PaymentItemID.FourteenGameDays;        
      case PaymentItemUrlID.TwentyEightGameDays:
        return PaymentItemID.TwentyEightGameDays;        
      case PaymentItemUrlID.OneHundredFourtyGameDays:
        return PaymentItemID.OneHundredFourtyGameDays;
      default:
        throw new Error(`Unknown Payment Item Url ID: ${itemUrlID}`);
    }
  },
  getItemUrlID: (itemID: PaymentItemID): PaymentItemUrlID => {
    switch(itemID) {
      case PaymentItemID.TwoGameDays:
        return PaymentItemUrlID.TwoGameDays;
      case PaymentItemID.FiveGameDays:
        return PaymentItemUrlID.FiveGameDays;
      case PaymentItemID.FourteenGameDays:
        return PaymentItemUrlID.FourteenGameDays;        
      case PaymentItemID.TwentyEightGameDays:
        return PaymentItemUrlID.TwentyEightGameDays;        
      case PaymentItemID.OneHundredFourtyGameDays:
        return PaymentItemUrlID.OneHundredFourtyGameDays;
      default:
        throw new Error(`Unknown Payment Item ID: ${itemID}`);
    }
  },
  getItemUrlIDFromParam: (itemUrlID: string): PaymentItemUrlID => {
    switch(itemUrlID) {
      case PaymentItemUrlID.TwoGameDays:
        return PaymentItemUrlID.TwoGameDays;
      case PaymentItemUrlID.FiveGameDays:
        return PaymentItemUrlID.FiveGameDays;
      case PaymentItemUrlID.FourteenGameDays:
        return PaymentItemUrlID.FourteenGameDays;        
      case PaymentItemUrlID.TwentyEightGameDays:
        return PaymentItemUrlID.TwentyEightGameDays;        
      case PaymentItemUrlID.OneHundredFourtyGameDays:
        return PaymentItemUrlID.OneHundredFourtyGameDays;
      default:
        throw new Error(`Unknown Payment Item Url ID: ${itemUrlID}`);
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