import { Icon } from "../../stroll-enums/icon";

interface IIconUtility {
  getUserIcons: () => Icon[];
}

export const IconUtility: IIconUtility = {
  getUserIcons: (): Icon[] => {
    return [
      Icon.Bat,
      Icon.Cat,
      Icon.Dog,
      Icon.Dragon,
      Icon.Duck,
      Icon.Elephant,
      Icon.Kiwi,
      Icon.Monkey,
      Icon.Narwhal,
      Icon.Pegasus,
      Icon.Pig,
      Icon.Rabbit,
      Icon.Rudolph,
      Icon.Squirrel,
      Icon.Turtle
    ]
  }
}