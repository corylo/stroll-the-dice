import { GameDayPurchaseOptionUnit } from "../stroll-enums/gameDayPurchaseOptionUnit";
import { Icon } from "../stroll-enums/icon";

export interface IGameDayPurchaseOption {
  icon: Icon;
  label: string;
  price: number;
  quantity: number;
  unit: GameDayPurchaseOptionUnit;
}