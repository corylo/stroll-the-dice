import React from "react";
import classNames from "classnames";

interface LoadingIconProps {
  animation?: "spin" | "blink";
}

export const LoadingIcon: React.FC<LoadingIconProps> = (
  props: LoadingIconProps
) => {
  return (
    <div className={classNames("loading-icon-wrapper", props.animation || "spin")}>
      <div className="loading-icon">
        <img src="/img/favicon.svg" />
      </div>
    </div>
  );
};
