import { Color } from "../../../../stroll-enums/color";
import { Icon } from "../../../../stroll-enums/icon";

export interface IProfileFormStateFields {
  color: Color;
  icon: Icon;
  name: string;
  username: string;
}

export const defaultProfileFormStateFields = (): IProfileFormStateFields => ({
  color: Color.None,
  icon: Icon.None,
  name: "",
  username: ""
});