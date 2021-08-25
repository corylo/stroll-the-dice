import React from "react";
import { Link } from "react-router-dom";

import { GameDayStatement } from "../../../../components/gameDayStatement/gameDayStatement";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";

import { Icon } from "../../../../../stroll-enums/icon";

interface GameDaysSectionProps {  
  available: number;
}

export const GameDaysSection: React.FC<GameDaysSectionProps> = (props: GameDaysSectionProps) => {  
  return (
    <ProfilePageSection className="game-days-section" icon={Icon.OneGameDay} title="My Game Days">
      <h1 className="game-days passion-one-font"><GameDayStatement quantity={props.available} /></h1>
      <Link
        className="go-to-shop-button button link fancy-button"            
        to="/shop"
      >
        <i className="fal fa-store" />
        <h1 className="passion-one-font">Go To Shop</h1>
      </Link>
    </ProfilePageSection>
  );
}