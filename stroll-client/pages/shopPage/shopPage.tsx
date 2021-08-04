import React, { useState } from "react";

import { AcceptedPayments } from "../../components/acceptedPayments/acceptedPayments";
import { GameDayPurchaseModal } from "./components/gameDayPurchaseModal/gameDayPurchaseModal";
import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { PoweredByStripe } from "../../components/poweredByStripe/poweredByStripe";
import { ShopSection } from "./components/shopSection/shopSection";

import { ImageUtility } from "../../utilities/imageUtility";
import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";
import { Graphic } from "../../../stroll-enums/graphic";

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
      backgroundGraphic={ImageUtility.getGraphic(Graphic.Shopping)} 
      requireAuth
    >     
      <PageTitle text="Shop" />   
      <PoweredByStripe />   
      <AcceptedPayments />
      <ShopSection 
        className="game-day-purchase-options"
        description={[
          "In order to take part in a game, you will need to purchase Game Days! The number of Game Days required is determined by the duration of the game.",
          "For example, joining a 5 day long game would require 5 Game Days."
        ]}
        title="Game Days"
      >
        {getGameDayPurchaseOptions()}
      </ShopSection>
      {getPurchaseModal()}
    </Page>
  )
}