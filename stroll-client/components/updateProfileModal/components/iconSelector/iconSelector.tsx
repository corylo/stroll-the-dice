import React, { useContext } from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";

import { AppContext } from "../../../app/contexts/appContext";

import { IconUtility } from "../../../../utilities/iconUtility";
import { PlayerLevelUtility } from "../../../../utilities/playerLevelUtility";

import { IIconTier } from "../../../../../stroll-models/iconTier";

import { Color } from "../../../../../stroll-enums/color";
import { Icon } from "../../../../../stroll-enums/icon";

interface IconSelectorProps {  
  color: Color;
  selected: Icon;
  select: (icon: Icon) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = (props: IconSelectorProps) => {  
  const { user } = useContext(AppContext).appState;

  const userLevel: number = PlayerLevelUtility.getLevelByExperience(user.profile.experience);

  const getOptions = (icons: Icon[], locked: boolean): JSX.Element[] => {
    return icons.map((icon: Icon) => {     
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
          disabled={locked}
          icon={icon} 
          styles={getStyles()}
          handleOnClick={() => props.select(icon)} 
        />
      )
    });
  }

  const getIconTiers = (): JSX.Element[] => {    
    return IconUtility.getUserIconTiers().map((tier: IIconTier) => {   
      const locked: boolean = userLevel < tier.minimumLevel;   

      return (
        <div key={tier.tierNumber} className={classNames("icon-selector-tier", { locked })}>
          <div className="icon-selector-tier-labels">
            <div className="icon-selector-tier-number-label icon-selector-tier-label">
              <h1 className="icon-selector-tier-label-value passion-one-font">{tier.tierNumber}</h1>
              <h1 className="icon-selector-tier-label-text passion-one-font">Tier</h1>
            </div>
            <div className="icon-selector-tier-level-label icon-selector-tier-label">
              <h1 className="icon-selector-tier-label-value passion-one-font">{tier.minimumLevel}+</h1>
              <h1 className="icon-selector-tier-label-text passion-one-font">Level</h1>
            </div>
          </div>
          <div className="icon-selector-tier-options">
            {getOptions(tier.icons, locked)}
            <i className="icon-selector-tier-locked-icon far fa-lock" />
          </div>
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