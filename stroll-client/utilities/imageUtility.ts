interface IImageUtility {
  getGraphic: (graphic: string, ext?: string) => string;
}

export const ImageUtility: IImageUtility = {
  getGraphic: (graphic: string, ext?: string): string => {
    return `/img/graphics/${graphic}.${ext || "svg"}`;
  }
}