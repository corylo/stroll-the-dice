import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface LoadingIconProps {
  
}

export const LoadingIcon: React.FC<LoadingIconProps> = (
  props: LoadingIconProps
) => {
  return (
    <div className="loading-icon-wrapper">
      <div className="loading-icon">
        <i className={Icon.AppBrand} />
      </div>
    </div>
  );
};
