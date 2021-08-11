import React, { useContext, useState } from "react";

import { GameDayPurchaseModal } from "./components/gameDayPurchaseModal/gameDayPurchaseModal";
import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { PoweredByStripe } from "../../components/poweredByStripe/poweredByStripe";
import { ShopSection } from "./components/shopSection/shopSection";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";

interface NotificationsPageProps {
  
}

export const ShopPage: React.FC<NotificationsPageProps> = (props: NotificationsPageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [option, setOption] = useState<IGameDayPurchaseOption>(null);

  const handleOnOptionClick = async (option: IGameDayPurchaseOption): Promise<void> => {
    if(appState.status === AppStatus.SignedIn) {
      setOption(option);
    } else {
      dispatch(AppAction.ToggleSignIn, true);
    }
  }

  const getGameDayPurchaseOptions = (): JSX.Element[] => {
    const getRecommendation = (unit: GameDayPurchaseOptionUnit): string => {
      if(unit === GameDayPurchaseOptionUnit.Five) {
        return "Recommended for new players!";
      } else if (unit === GameDayPurchaseOptionUnit.OneHundredFourty) {
        return "Enough to cover 20 players for a 7 day game!";
      }
    }

    return GameDayUtility.getGameDayPurchaseOptions().map((option: IGameDayPurchaseOption, index: number) => (    
      <GameDayPurchaseOption 
        key={option.unit} 
        discount={option.unit !== GameDayPurchaseOptionUnit.Two}
        option={option}
        recommendation={getRecommendation(option.unit)}
        handleOnClick={() => handleOnOptionClick(option)}
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
    <Page id="shop-page" backgroundGraphic="">     
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