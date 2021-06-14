import React from "react";
import { Link } from "react-router-dom";

interface BrandProps {
  showBrandText?: boolean;
}

export const Brand: React.FC<BrandProps> = (props: BrandProps) => {
  const getBrandText = (): JSX.Element | null => {
    if(props.showBrandText !== undefined && props.showBrandText === false) {
      return null;
    }

    return (
      <h1 className="lobster-font">Stroll The Dice</h1>
    );
  }

  return(
    <Link className="app-brand" to="/">
      <i className="fal fa-running" />
      {getBrandText()}
    </Link>
  )
}