import React, { useContext } from "react";

import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";

import { AppContext } from "../../components/app/contexts/appContext";

import { ImageUtility } from "../../utilities/imageUtility";
import { ShopUtility } from "../../../stroll-utilities/shopUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { Graphic } from "../../../stroll-enums/graphic";

interface NotificationsPageProps {
  
}

export const ShopPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState } = useContext(AppContext);

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
      <div className="game-day-purchase-options">
        {getGameDayPurchaseOptions()}
      </div>
    </Page>
  )
}