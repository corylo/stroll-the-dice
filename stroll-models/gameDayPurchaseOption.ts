import { GameDayPurchaseOptionUnit } from "../stroll-enums/gameDayPurchaseOptionUnit";
import { Icon } from "../stroll-enums/icon";

export interface IGameDayPurchaseOption {
  icon: Icon;
  label: string;
  price: number;
  quantity: number;
  unit: GameDayPurchaseOptionUnit;
}

export const defaultGameDayPurchaseOption = (): IGameDayPurchaseOption => ({
  icon: Icon.OneGameDay,
  label: "",
  price: 0,
  quantity: 0,
  unit: GameDayPurchaseOptionUnit.Two
});