import React from "react";

interface PageBackgroundGraphicProps {  
  img: string;
}

export const PageBackgroundGraphic: React.FC<PageBackgroundGraphicProps> = (props: PageBackgroundGraphicProps) => {  
  return (
    <img className="page-background-graphic-image" src={props.img} />
  );
}