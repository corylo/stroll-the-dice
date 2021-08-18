import React from "react";

interface SvgBlobProps {  
  index: number;
}

export const SvgBlob: React.FC<SvgBlobProps> = (props: SvgBlobProps) => {  
  return (
    <img className="svg-blob" src={`/img/blobs/blob-${props.index}.svg`} />
  );
}