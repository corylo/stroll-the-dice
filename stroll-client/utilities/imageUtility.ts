import { StrollTheDiceCDN } from "../../stroll-enums/strollTheDiceCDN";

interface IImageUtility {
  getBlob: (index: number) => string;
  getGraphic: (graphic: string, ext?: string) => string;
  getGraphicPreview: (graphic: string, ext?: string) => string;
}

export const ImageUtility: IImageUtility = {
  getBlob: (index: number): string => {
    return `${StrollTheDiceCDN.Url}/img/blobs/blob-${index}.svg`;
  },
  getGraphic: (graphic: string, ext?: string): string => {
    return `${StrollTheDiceCDN.Url}/img/graphics/${graphic}.${ext || "svg"}`;
  },
  getGraphicPreview: (graphic: string, ext?: string): string => {
    return `${StrollTheDiceCDN.Url}/img/graphics/${graphic}-preview.${ext || "svg"}`;
  }
}