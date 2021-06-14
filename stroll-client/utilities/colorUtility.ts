import { Color } from "../../stroll-enums/color";

interface IColorUtility {
  getColors: () => Color[];
}

export const ColorUtility: IColorUtility = {
  getColors: (): Color[] => {
    return [
      Color.Blue,
      Color.Green,
      Color.Orange,
      Color.Purple,
      Color.Red
    ]
  }
}