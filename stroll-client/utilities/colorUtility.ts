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
      Color.Orange1,
      Color.Orange2,
      Color.Orange3,
      Color.Yellow1,
      Color.Yellow2,
      Color.Yellow3,
      Color.Green1,
      Color.Green2,
      Color.Green3,
      Color.Blue1,
      Color.Blue2,
      Color.Blue3,
      Color.Purple1,
      Color.Purple2,
      Color.Purple3,
      Color.Brown1,
      Color.Brown2,
      Color.Brown3,
      Color.Gray,
      Color.White,
    ]
  }
}