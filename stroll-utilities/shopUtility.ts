import { PaymentUtility } from "./paymentUtility";

import { IGameDayPurchaseOption } from "../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../stroll-enums/gameDayPurchaseOptionUnit";
import { Icon } from "../stroll-enums/icon";
import { PaymentItemID } from "../stroll-enums/paymentItemID";

interface IShopUtility {
  getGameDayPaymentItemID: (unit: GameDayPurchaseOptionUnit) => PaymentItemID;
  getGameDayPurchaseOptionPrice: (unit: GameDayPurchaseOptionUnit) => number;
  getGameDayPurchaseOptions: () => IGameDayPurchaseOption[];
}

export const ShopUtility: IShopUtility = {
  getGameDayPaymentItemID: (unit: GameDayPurchaseOptionUnit): PaymentItemID => {
    switch(unit) {
      case GameDayPurchaseOptionUnit.One:
        return PaymentItemID.OneGameDay;       
      case GameDayPurchaseOptionUnit.Five:
        return PaymentItemID.FiveGameDays;      
      case GameDayPurchaseOptionUnit.Fourteen:
        return PaymentItemID.FourteenGameDays;       
      case GameDayPurchaseOptionUnit.TwentyEight:
        return PaymentItemID.TwentyEightGameDays;        
      case GameDayPurchaseOptionUnit.OneHundredFourty:
        return PaymentItemID.OneHundredFourtyGameDays;
      default:
        throw new Error(`Unknown game day purchase option unit: ${unit}`);
    }
  },
  getGameDayPurchaseOptionPrice: (unit: GameDayPurchaseOptionUnit): number => {
    return PaymentUtility.getPrice(ShopUtility.getGameDayPaymentItemID(unit));
  },
  getGameDayPurchaseOptions: (): IGameDayPurchaseOption[] => {
    return [{
      icon: Icon.OneGameDay,
      label: "Single Day",
      price: 0,
      quantity: 1,
      unit: GameDayPurchaseOptionUnit.One
    }, {
      icon: Icon.FiveGameDays,
      label: "Pouch of Days",
      price: 0,
      quantity: 5,
      unit: GameDayPurchaseOptionUnit.Five
    }, {
      icon: Icon.FourteenGameDays,
      label: "Box of Days",
      price: 0,
      quantity: 14,
      unit: GameDayPurchaseOptionUnit.Fourteen
    }, {
      icon: Icon.TwentyEightGameDays,
      label: "Chest of Days",
      price: 0,
      quantity: 28,
      unit: GameDayPurchaseOptionUnit.TwentyEight
    }, {
      icon: Icon.OneHundredFourtyGameDays,
      label: "Air Drop of Days",
      price: 0,
      quantity: 140,
      unit: GameDayPurchaseOptionUnit.OneHundredFourty
    }].map((option: IGameDayPurchaseOption) => ({
      ...option,
      price: ShopUtility.getGameDayPurchaseOptionPrice(option.unit)
    }))
  }
}