import React from "react";

import { useLoadImageEffect } from "../../effects/appEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { ImageStatus } from "../../enums/imageStatus";

interface PageBackgroundGraphicProps {  
  graphic: string;
}

export const PageBackgroundGraphic: React.FC<PageBackgroundGraphicProps> = (props: PageBackgroundGraphicProps) => {  
  const previewSource: string = ImageUtility.getGraphicPreview(props.graphic, "png"),
    loadedSource: string = ImageUtility.getGraphic(props.graphic, "png");

  const { status } = useLoadImageEffect(previewSource, loadedSource);

  if(status === ImageStatus.Preview) {
    return (
      <img className="page-background-graphic-image preview" src={previewSource} />
    );
  } else if (status === ImageStatus.Loaded) {
    return (
      <img className="page-background-graphic-image" src={loadedSource} />
    );
  }

  return null;
}