import React from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";

import { ColorUtility } from "../../../../utilities/colorUtility";

import { Color } from "../../../../../stroll-enums/color";

interface ColorSelectorProps {  
  selected: Color;
  select: (color: Color) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = (props: ColorSelectorProps) => {  
  const getOptions = (): JSX.Element[] => {
    return ColorUtility.getColors().map((color: Color) => {
      const selected: boolean = color === props.selected;

      const getStyles = (): React.CSSProperties => {
        if(selected) {
          return { 
            backgroundColor: `rgba(${color}, 0.1)`, 
            color: `rgb(${color}` 
          };
        }

        return { color: `rgb(${color}` };
      }

      return (
        <IconButton  
          key={color}
          className={classNames("color-selector-option", { selected })}
          icon="fas fa-circle"
          styles={getStyles()}
          handleOnClick={() => props.select(color)} 
        />
      )
    });
  }

  return (
    <div className="color-selector">
      {getOptions()}
    </div>
  );
}