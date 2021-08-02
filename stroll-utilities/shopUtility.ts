import { IGameDayPurchaseOption } from "../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../stroll-enums/gameDayPurchaseOptionUnit";
import { Icon } from "../stroll-enums/icon";

interface IShopUtility {
  getGameDayPurchaseOptions: () => IGameDayPurchaseOption[];
}

export const ShopUtility: IShopUtility = {
  getGameDayPurchaseOptions: (): IGameDayPurchaseOption[] => {
    return [{
      icon: Icon.OneGameDay,
      label: "Single Game Day",
      price: 0.99,
      quantity: 1,
      unit: GameDayPurchaseOptionUnit.One
    }, {
      icon: Icon.FiveGameDays,
      label: "Sack of Game Days",
      price: 2.99,
      quantity: 5,
      unit: GameDayPurchaseOptionUnit.Five
    }, {
      icon: Icon.FourteenGameDays,
      label: "Box of Game Days",
      price: 4.99,
      quantity: 14,
      unit: GameDayPurchaseOptionUnit.Fourteen
    }, {
      icon: Icon.TwentyEightGameDays,
      label: "Chest of Game Days",
      price: 6.99,
      quantity: 28,
      unit: GameDayPurchaseOptionUnit.TwentyEight
    }, {
      icon: Icon.OneHundredFourtyGameDays,
      label: "Air Drop of Game Days",
      price: 29.99,
      quantity: 140,
      unit: GameDayPurchaseOptionUnit.OneHundredFourty
    }]
  }
}