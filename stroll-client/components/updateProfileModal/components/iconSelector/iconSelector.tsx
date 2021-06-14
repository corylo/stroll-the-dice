import React from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";

import { IconUtility } from "../../../../utilities/iconUtility";

import { Color } from "../../../../../stroll-enums/color";
import { Icon } from "../../../../../stroll-enums/icon";

interface IconSelectorProps {  
  color: Color;
  selected: Icon;
  select: (icon: Icon) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = (props: IconSelectorProps) => {  
  const getOptions = (): JSX.Element[] => {
    return IconUtility.getIcons().map((icon: Icon) => {     
      const selected: boolean = icon === props.selected;

      const getStyles = (): React.CSSProperties => {
        const styles: React.CSSProperties = {};

        if(props.color) {
          styles.color = `rgb(${props.color}`;

          if(selected) {
            styles.backgroundColor = `rgba(${props.color}, 0.3)`;
          }
        }
          
        return styles;
      }

      return (
        <IconButton 
          key={icon}
          className={classNames("icon-selector-option", { selected })}
          icon={icon} 
          styles={getStyles()}
          handleOnClick={() => props.select(icon)} 
        />
      )
    });
  }

  return (
    <div className="icon-selector">
      {getOptions()}
    </div>
  );
}