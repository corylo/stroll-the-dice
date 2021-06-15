interface IImageUtility {
  getGraphic: (graphic: string) => string;
}

export const ImageUtility: IImageUtility = {
  getGraphic: (graphic: string): string => {
    return `/img/graphics/${graphic}.svg`;
  }
}