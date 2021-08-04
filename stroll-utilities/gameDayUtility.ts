import { PaymentUtility } from "./paymentUtility";

import { defaultGameDayPurchaseOption, IGameDayPurchaseOption } from "../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../stroll-enums/gameDayPurchaseOptionUnit";
import { Icon } from "../stroll-enums/icon";
import { PaymentItemID } from "../stroll-enums/paymentItemID";

interface IGameDayUtility {
  getDayBonus: (quantity: number) => number;
  getDayQuantity: (unit: GameDayPurchaseOptionUnit) => number;
  getGameDayPaymentItemID: (unit: GameDayPurchaseOptionUnit) => PaymentItemID;
  getGameDayPurchaseOptionPrice: (unit: GameDayPurchaseOptionUnit) => number;
  getGameDayPurchaseOptionUnit: (itemID: PaymentItemID) => GameDayPurchaseOptionUnit;
  getGameDayPurchaseOptions: () => IGameDayPurchaseOption[];
  isGameDayPurchase: (itemID: PaymentItemID) => boolean;
}

export const GameDayUtility: IGameDayUtility = {
  getDayBonus: (quantity: number): number => {
    const bonus: number = Math.round(quantity * 0.25);

    if(bonus < 10) {
      return bonus;
    }

    return Math.ceil(bonus / 10) * 10;
  },
  getDayQuantity: (unit: GameDayPurchaseOptionUnit): number => {
    switch(unit) {
      case GameDayPurchaseOptionUnit.One:
        return 1;       
      case GameDayPurchaseOptionUnit.Five:
        return 5;      
      case GameDayPurchaseOptionUnit.Fourteen:
        return 14;       
      case GameDayPurchaseOptionUnit.TwentyEight:
        return 28;        
      case GameDayPurchaseOptionUnit.OneHundredFourty:
        return 140;
      default:
        throw new Error(`Unknown game day purchase option unit: ${unit}`);
    }
  },
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
    return PaymentUtility.getPrice(GameDayUtility.getGameDayPaymentItemID(unit));
  },
  getGameDayPurchaseOptionUnit: (itemID: PaymentItemID): GameDayPurchaseOptionUnit => {
    switch(itemID) {
      case PaymentItemID.OneGameDay:
        return GameDayPurchaseOptionUnit.One;
      case PaymentItemID.FiveGameDays:
        return GameDayPurchaseOptionUnit.Five;
      case PaymentItemID.FourteenGameDays:
        return GameDayPurchaseOptionUnit.Fourteen;        
      case PaymentItemID.TwentyEightGameDays:
        return GameDayPurchaseOptionUnit.TwentyEight;        
      case PaymentItemID.OneHundredFourtyGameDays:
        return GameDayPurchaseOptionUnit.OneHundredFourty;
      default:
        throw new Error(`Unknown Payment Item ID: ${itemID}`);
    }
  },
  getGameDayPurchaseOptions: (): IGameDayPurchaseOption[] => {
    return [{
      ...defaultGameDayPurchaseOption(),
      icon: Icon.OneGameDay,
      label: "Single Day",
      unit: GameDayPurchaseOptionUnit.One
    }, {
      ...defaultGameDayPurchaseOption(),
      icon: Icon.FiveGameDays,
      label: "Pouch of Days",
      unit: GameDayPurchaseOptionUnit.Five
    }, {
      ...defaultGameDayPurchaseOption(),
      icon: Icon.FourteenGameDays,
      label: "Box of Days",
      unit: GameDayPurchaseOptionUnit.Fourteen
    }, {
      ...defaultGameDayPurchaseOption(),
      icon: Icon.TwentyEightGameDays,
      label: "Chest of Days",
      unit: GameDayPurchaseOptionUnit.TwentyEight
    }, {
      ...defaultGameDayPurchaseOption(),
      icon: Icon.OneHundredFourtyGameDays,
      label: "Air Drop of Days",
      unit: GameDayPurchaseOptionUnit.OneHundredFourty
    }].map((option: IGameDayPurchaseOption) => ({
      ...option,
      quantity: GameDayUtility.getDayQuantity(option.unit),
      price: GameDayUtility.getGameDayPurchaseOptionPrice(option.unit)
    }))
  },
  isGameDayPurchase: (itemID: PaymentItemID): boolean => {
    return (
      itemID === PaymentItemID.OneGameDay ||
      itemID === PaymentItemID.FiveGameDays ||
      itemID === PaymentItemID.FourteenGameDays ||
      itemID === PaymentItemID.TwentyEightGameDays ||
      itemID === PaymentItemID.OneHundredFourtyGameDays
    )
  }
}