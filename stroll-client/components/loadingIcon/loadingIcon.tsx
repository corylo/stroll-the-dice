import classNames from "classnames";
import React from "react";

import { Icon } from "../../../stroll-enums/icon";

interface LoadingIconProps {
  animation?: "spin" | "blink";
}

export const LoadingIcon: React.FC<LoadingIconProps> = (
  props: LoadingIconProps
) => {
  return (
    <div className={classNames("loading-icon-wrapper", props.animation || "spin")}>
      <div className="loading-icon">
        <i className={Icon.AppBrand} />
      </div>
    </div>
  );
};
