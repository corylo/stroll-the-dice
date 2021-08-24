import React from "react";
import { Link } from "react-router-dom";

import { ImageUtility } from "../../utilities/imageUtility";

interface BrandProps {
  showBrandText?: boolean;
}

export const Brand: React.FC<BrandProps> = (props: BrandProps) => {
  return(
    <Link className="app-brand" to="/">
      <img src={ImageUtility.getLogo()} />
    </Link>
  )
}