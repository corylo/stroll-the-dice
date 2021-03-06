import { StrollTheDiceCDN } from "../../stroll-enums/strollTheDiceCDN";

interface IImageUtility {
  getGraphic: (graphic: string, ext?: string) => string;
  getGraphicPreview: (graphic: string, ext?: string) => string;
  getLogo: () => string;
}

export const ImageUtility: IImageUtility = {
  getGraphic: (graphic: string, ext?: string): string => {
    return `${StrollTheDiceCDN.Url}/img/graphics/${graphic}.${ext || "svg"}`;
  },
  getGraphicPreview: (graphic: string, ext?: string): string => {
    return `${StrollTheDiceCDN.Url}/img/graphics/${graphic}-preview.${ext || "svg"}`;
  },
  getLogo: (): string => {
    return `${StrollTheDiceCDN.Url}/img/logo.png`;
  }
}