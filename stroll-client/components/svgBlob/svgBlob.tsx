import React from "react";

import { ImageUtility } from "../../utilities/imageUtility";

interface SvgBlobProps {  
  index: number;
}

export const SvgBlob: React.FC<SvgBlobProps> = (props: SvgBlobProps) => {  
  return (
    <img className="svg-blob" src={ImageUtility.getBlob(props.index)} />
  );
}