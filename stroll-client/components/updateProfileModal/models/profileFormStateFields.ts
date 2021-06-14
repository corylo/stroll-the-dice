import { Color } from "../../../../stroll-enums/color";
import { Icon } from "../../../../stroll-enums/icon";

export interface IProfileFormStateFields {
  color: Color;
  icon: Icon;
  username: string;
}

export const defaultProfileFormStateFields = (): IProfileFormStateFields => ({
  color: Color.None,
  icon: Icon.None,
  username: ""
});