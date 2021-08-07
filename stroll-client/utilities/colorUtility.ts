import { Color } from "../../stroll-enums/color";

interface IColorUtility {
  getUserColors: () => Color[];
}

export const ColorUtility: IColorUtility = {
  getUserColors: (): Color[] => {
    return [
      Color.Red1,
      Color.Red3,
      Color.Red5,
      Color.Orange1,
      Color.Orange3,
      Color.Orange5,
      Color.Yellow1,
      Color.Yellow3,
      Color.Yellow5,
      Color.Green1,
      Color.Green3,
      Color.Green5,
      Color.Blue3,
      Color.Blue4,
      Color.Blue5,
      Color.Purple3,
      Color.Purple4,
      Color.Purple5,
      Color.Brown2,
      Color.Brown4,
      Color.Brown5,
      Color.Gray4,
      Color.Gray5,
    ]
  }
}