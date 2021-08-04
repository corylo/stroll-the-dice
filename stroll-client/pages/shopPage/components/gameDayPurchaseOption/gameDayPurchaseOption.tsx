import React from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";

import { IGameDayPurchaseOption } from "../../../../../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../../../../../stroll-enums/gameDayPurchaseOptionUnit";

interface GameDayPurchaseOptionProps {  
  discount?: boolean;
  option: IGameDayPurchaseOption;
  presentationMode?: boolean;
  handleOnClick?: () => void;
}

export const GameDayPurchaseOption: React.FC<GameDayPurchaseOptionProps> = (props: GameDayPurchaseOptionProps) => {  
  const { option } = props;

  const daily: number = option.price / option.quantity;


  const getDiscountLabel = (): JSX.Element => {
    if(props.discount) {
      const daily: number = option.price / option.quantity,
        percent: string = ((1 - daily) * 100).toFixed(0);

      return (
        <h1 className="game-day-purchase-option-discount-label passion-one-font">
          <span className="highlight-custom"><span className="percent">{percent}%</span> less per day!</span>
        </h1>
      )
    }
  }

  const getRecommendationStatement = (): JSX.Element => {
    if(!props.presentationMode && option.unit === GameDayPurchaseOptionUnit.Five) {
      return (
        <h1 className="game-day-purchase-option-recommendation-statement passion-one-font">Recommended for new players!</h1>
      )
    }
  }

  const getHandleOnClick = (): any => {
    if(props.handleOnClick) {
      return props.handleOnClick;
    }

    return () => {};
  }

  return (   
    <Button
      className={classNames("game-day-purchase-option", "fancy-option-button")}     
      disabled={props.handleOnClick === undefined}
      handleOnClick={getHandleOnClick()} 
    >
      <i className={classNames(option.icon, "game-day-purchase-option-icon")} />      
      <div className="game-day-purchase-option-content">
        <h1 className="game-day-purchase-option-label passion-one-font">{option.label} ( {option.quantity} )</h1>
        <h1 className="game-day-purchase-option-daily-price passion-one-font">${daily.toFixed(2)} / Day</h1>
        <h1 className="game-day-purchase-option-price passion-one-font">${option.price}</h1>
        {getRecommendationStatement()}
        {getDiscountLabel()}
      </div>
    </Button>
  );
}