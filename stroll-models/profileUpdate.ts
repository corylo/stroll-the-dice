import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfileUpdate {
  color: Color;
  icon: Icon;
  name: string;
  username: string;
}