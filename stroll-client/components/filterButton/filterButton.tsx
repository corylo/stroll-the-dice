import React from "react";
import classNames from "classnames";

import { Label } from "../label/label";

interface FilterButtonProps {  
  icon?: string;
  selected: boolean;
  text: string;
  handleOnClick: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = (props: FilterButtonProps) => {    
  return (
    <Label
      className={classNames("filter-button", { selected: props.selected })}
      icon={props.icon}
      text={props.text}
      handleOnClick={props.handleOnClick}
    />
  );
}