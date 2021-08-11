import React from "react";
import { Link } from "react-router-dom";

import { Icon } from "../../../stroll-enums/icon";

interface BrandProps {
  showBrandText?: boolean;
}

export const Brand: React.FC<BrandProps> = (props: BrandProps) => {
  const getBrandText = (): JSX.Element | null => {
    if(props.showBrandText !== undefined && props.showBrandText === false) {
      return null;
    }

    return (
      <h1 className="app-brand-name lobster-font">Stroll The Dice</h1>
    );
  }

  return(
    <Link className="app-brand" to="/">
      <i className={Icon.AppBrand} />
      {getBrandText()}
    </Link>
  )
}