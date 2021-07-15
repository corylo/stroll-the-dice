import { Color } from "../../stroll-enums/color";

interface IColorUtility {
  getUserColors: () => Color[];
}

export const ColorUtility: IColorUtility = {
  getUserColors: (): Color[] => {
    return [
      Color.Red1,
      Color.Red2,
      Color.Red3,
      Color.Red4,
      Color.Red5,
      Color.Orange1,
      Color.Orange2,
      Color.Orange3,
      Color.Orange4,
      Color.Orange5,
      Color.Yellow1,
      Color.Yellow2,
      Color.Yellow3,
      Color.Yellow4,
      Color.Yellow5,
      Color.Green1,
      Color.Green2,
      Color.Green3,
      Color.Green4,
      Color.Green5,
      Color.Blue1,
      Color.Blue3,
      Color.Blue4,
      Color.Blue5,
      Color.Purple2,
      Color.Purple3,
      Color.Purple4,
      Color.Purple5,
      Color.Brown2,
      Color.Brown3,
      Color.Brown4,
      Color.Brown5,
      Color.Gray4,
      Color.Gray5,
    ]
  }
}