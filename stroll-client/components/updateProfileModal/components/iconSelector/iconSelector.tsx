import React, { useContext } from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";

import { IconUtility } from "../../../../utilities/iconUtility";

import { IIconTier } from "../../../../../stroll-models/iconTier";

import { Color } from "../../../../../stroll-enums/color";
import { Icon } from "../../../../../stroll-enums/icon";
import { AppContext } from "../../../app/contexts/appContext";
import { PlayerLevelUtility } from "../../../../utilities/playerLevelUtility";

interface IconSelectorProps {  
  color: Color;
  selected: Icon;
  select: (icon: Icon) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = (props: IconSelectorProps) => {  
  const { user } = useContext(AppContext).appState;

  const userLevel: number = PlayerLevelUtility.getLevelByExperience(user.profile.experience);

  const getOptions = (icons: Icon[], minimumLevel: number): JSX.Element[] => {
    return icons.map((icon: Icon) => {     
      const selected: boolean = icon === props.selected,
        disabled: boolean = userLevel < minimumLevel;

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
          disabled={disabled}
          icon={icon} 
          styles={getStyles()}
          handleOnClick={() => props.select(icon)} 
        />
      )
    });
  }

  const getIconTiers = (): JSX.Element[] => {
    return IconUtility.getUserIconTiers().map((tier: IIconTier) => {      
      return (
        <div key={tier.tierNumber} className="icon-selector-tier">
          <div className="icon-selector-tier-options">
            {getOptions(tier.icons, tier.minimumLevel)}
          </div>
          <h1 className="icon-selector-tier-label passion-one-font">Tier {tier.tierNumber} (Lvl. {tier.minimumLevel} +)</h1>
        </div>
      )
    });
  }

  return (
    <div className="icon-selector">
      <div className="icon-selector-tiers scroll-bar">
        {getIconTiers()}
      </div>
    </div>
  );
}