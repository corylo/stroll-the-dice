import React from "react";

import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { ShopSection } from "./components/shopSection/shopSection";

import { ImageUtility } from "../../utilities/imageUtility";
import { ShopUtility } from "../../../stroll-utilities/shopUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { Graphic } from "../../../stroll-enums/graphic";

interface NotificationsPageProps {
  
}

export const ShopPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const getGameDayPurchaseOptions = (): JSX.Element[] => {
    return ShopUtility.getGameDayPurchaseOptions().map((option: IGameDayPurchaseOption, index: number) => (    
      <GameDayPurchaseOption 
        key={option.unit} 
        discount={index > 0}
        option={option}
      />
    ));
  }

  return(
    <Page 
      id="shop-page" 
      backgroundGraphic={ImageUtility.getGraphic(Graphic.Shopping)} 
      requireAuth
    >     
      <PageTitle text="Shop" />      
      <ShopSection 
        className="game-day-purchase-options"
        description="In order to take part in a game, you will need to purchase Game Days! The number of Game Days required is determined by the duration of the game."
        title="Game Days"
      >
        {getGameDayPurchaseOptions()}
      </ShopSection>
    </Page>
  )
}