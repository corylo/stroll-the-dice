import React from "react";

interface LoadingIconProps {
  
}

export const LoadingIcon: React.FC<LoadingIconProps> = (
  props: LoadingIconProps
) => {
  return (
    <div className="loading-icon-wrapper">
      <div className="loading-icon">
        <i className="fad fa-gavel" />
      </div>
    </div>
  );
};
