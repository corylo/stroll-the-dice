import React from "react";

import { IconScrollerTier } from "./iconScrollerTier";

import { IconUtility } from "../../utilities/iconUtility";

import { IIconTier } from "../../../stroll-models/iconTier";

interface IconScrollerProps {  
  
}

export const IconScroller: React.FC<IconScrollerProps> = (props: IconScrollerProps) => {    
  const tier3: IIconTier = IconUtility.getUserIconsByTier(3),
    tier6: IIconTier = IconUtility.getUserIconsByTier(6),
    tier8: IIconTier = IconUtility.getUserIconsByTier(8);

  return (
    <div className="icon-scroller">
      <IconScrollerTier tier={tier3} />
      <IconScrollerTier tier={tier6} />
      <IconScrollerTier tier={tier8} />
    </div>
  );
}