import React from "react";
import classNames from "classnames";

import { IIconTier } from "../../../stroll-models/iconTier";

import { Color } from "../../../stroll-enums/color";
import { Icon } from "../../../stroll-enums/icon";

interface IconScrollerTierProps {  
  tier: IIconTier;
}

export const IconScrollerTier: React.FC<IconScrollerTierProps> = (props: IconScrollerTierProps) => {    
  const { icons } = props.tier;

  const getRows = (): JSX.Element[] => {
    const chunkSize: number = Math.max(Math.round(icons.length / 3), 5);

    let iconChunks: Icon[][] = [];

    for(let i: number = 0; i < props.tier.icons.length; i += chunkSize) {
      iconChunks.push(icons.slice(i, i + chunkSize));
    }

    const colors: Color[] = [Color.Green1, Color.Red1, Color.Purple1, Color.Blue1, Color.Yellow1];

    return iconChunks.map((chunk: Icon[], chunkIndex: number) => {
      const items: JSX.Element[] = chunk.map((icon: Icon, index: number) => {
        console.log(((chunkIndex * chunkSize) + index))
        const color: Color = colors[((chunkIndex * chunkSize) + index) % 5];

        const classes: string = classNames("icon-scroller-tier-item", icon);

        const styles: React.CSSProperties = { 
          color: `rgb(${color})` 
        };

        return (
          <i key={icon} className={classes} style={styles} />
        )
      });

      return (
        <div key={chunkIndex} className="icon-scroller-tier-item-row">
          {items}
        </div>
      )
    });
  }

  return (
    <div className="icon-scroller-tier">
      <div className="icon-scroller-tier-label">
        <h1 className="icon-scroller-tier-number passion-one-font">Tier {props.tier.tierNumber}</h1>
        <h1 className="icon-scroller-tier-minimum-level passion-one-font">Level {props.tier.minimumLevel}+</h1>
      </div>
      <div className="icon-scroller-tier-item-rows">
        {getRows()}
      </div>
    </div>
  );
}