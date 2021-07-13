import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfileReference {
  color: Color;
  icon: Icon;
  uid: string;
  username: string;
}

export const defaultProfileReference = (): IProfileReference => ({
  color: Color.None,
  icon: Icon.None,
  uid: "",
  username: ""
});