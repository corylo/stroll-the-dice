import React from "react";
import { Link } from "react-router-dom";

interface BrandProps {
  showBrandText?: boolean;
}

export const Brand: React.FC<BrandProps> = (props: BrandProps) => {
  return(
    <Link className="app-brand" to="/">
      <img src="/img/logo.png" />
    </Link>
  )
}