import React, { useState } from "react";

import { GameDayPurchaseModal } from "./components/gameDayPurchaseModal/gameDayPurchaseModal";
import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { PoweredByStripe } from "../../components/poweredByStripe/poweredByStripe";
import { ShopSection } from "./components/shopSection/shopSection";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";

interface NotificationsPageProps {
  
}

export const ShopPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const [option, setOption] = useState<IGameDayPurchaseOption>(null);

  const getGameDayPurchaseOptions = (): JSX.Element[] => {
    return GameDayUtility.getGameDayPurchaseOptions().map((option: IGameDayPurchaseOption, index: number) => (    
      <GameDayPurchaseOption 
        key={option.unit} 
        discount={option.unit !== GameDayPurchaseOptionUnit.One}
        option={option}
        handleOnClick={() => setOption(option)}
      />
    ));
  }

  const getPurchaseModal = (): JSX.Element => {
    if(option) {
      return (
        <GameDayPurchaseModal option={option} back={() => setOption(null)} />
      )
    }
  }

  return(    
    <Page 
      id="shop-page" 
      backgroundGraphic=""
      requireAuth
    >     
      <PageTitle text="Shop" />   
      <PoweredByStripe />   
      <ShopSection 
        className="game-day-purchase-options"
        title="Game Days"
      >
        {getGameDayPurchaseOptions()}
      </ShopSection>
      {getPurchaseModal()}
    </Page>
  )
}