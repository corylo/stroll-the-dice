import { Icon } from "../../stroll-enums/icon";

interface IIconUtility {
  getIcons: () => Icon[];
}

export const IconUtility: IIconUtility = {
  getIcons: (): Icon[] => {
    return [
      Icon.Dragon,
      Icon.Elephant,
      Icon.Kiwi,
      Icon.Monkey,
      Icon.Narwhal
    ]
  }
}