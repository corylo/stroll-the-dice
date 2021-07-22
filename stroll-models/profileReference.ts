import { Color } from "../stroll-enums/color";
import { Icon } from "../stroll-enums/icon";

export interface IProfileReference {
  color: Color;
  icon: Icon;
  name: string;
  uid: string;
  username: string;
}

export const defaultProfileReference = (): IProfileReference => ({
  color: Color.None,
  icon: Icon.None,
  name: "",
  uid: "",
  username: ""
});