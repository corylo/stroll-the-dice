import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { GameDayPurchaseModal } from "./components/gameDayPurchaseModal/gameDayPurchaseModal";
import { GameDayPurchaseOption } from "./components/gameDayPurchaseOption/gameDayPurchaseOption";
import { Page } from "../../components/page/page";
import { PageTitle } from "../../components/page/pageTitle";
import { PoweredByStripe } from "../../components/poweredByStripe/poweredByStripe";
import { ShopSection } from "./components/shopSection/shopSection";

import { AppContext } from "../../components/app/contexts/appContext";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";
import { UrlUtility } from "../../utilities/urlUtility";

import { IGameDayPurchaseOption } from "../../../stroll-models/gameDayPurchaseOption";

import { AppAction } from "../../enums/appAction";
import { AppStatus } from "../../enums/appStatus";
import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";
import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { PaymentItemUrlID } from "../../../stroll-enums/paymentItemUrlID";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IShopPageState {
  completionStatus: RequestStatus;
  option: IGameDayPurchaseOption;
}

interface ShopPageProps {
  
}

export const ShopPage: React.FC<ShopPageProps> = (props: ShopPageProps) => {
  const { appState, dispatchToApp } = useContext(AppContext);

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const [state, setState] = useState<IShopPageState>({ 
    completionStatus: RequestStatus.Idle, 
    option: null
  });

  const updateOption = (option: IGameDayPurchaseOption): void => {
    setState({ ...state, option });
  }

  const history: any = useHistory();

  useEffect(() => {
    try {
      const itemIDParam: string = UrlUtility.getQueryParam("id");
      
      if(itemIDParam) {
        const itemUrlID: PaymentItemUrlID = PaymentUtility.getItemUrlIDFromParam(itemIDParam),
          itemID: PaymentItemID = PaymentUtility.getItemIDFromItemUrlID(itemUrlID),
          unit: GameDayPurchaseOptionUnit = GameDayUtility.getGameDayPurchaseOptionUnit(itemID);
          
        const successParam: string = UrlUtility.getQueryParam("success"),
          errorParam: string = UrlUtility.getQueryParam("error");

        const updates: IShopPageState = { ...state };

        if(successParam) {
          updates.completionStatus = RequestStatus.Success;
        } else if(errorParam) {
          updates.completionStatus = RequestStatus.Error;
        }

        UrlUtility.clearParam(history, "id");

        updates.option = GameDayUtility.getGameDayPurchaseOption(unit);

        setState(updates);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleOnOptionClick = async (option: IGameDayPurchaseOption): Promise<void> => {
    if(appState.status === AppStatus.SignedIn) {
      updateOption(option);
    } else {
      dispatch(AppAction.ToggleSignIn, true);
    }
  }

  const handleModalClose = (): void => {
    if(state.completionStatus === RequestStatus.Success) {
      window.close();
    }
    
    setState({ completionStatus: RequestStatus.Idle, option: null });
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
    if(state.option) {
      return (
        <GameDayPurchaseModal 
          completionStatus={state.completionStatus}
          option={state.option} 
          back={handleModalClose} 
        />
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