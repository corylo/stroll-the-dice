import React from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";

import { GameDayUtility } from "../../../../../stroll-utilities/gameDayUtility";

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

  const getHandleOnClick = (): any => {
    if(props.handleOnClick) {
      return props.handleOnClick;
    }

    return () => {};
  }

  const getDiscountLabel = (): JSX.Element => {
    if(props.discount) {
      const daily: number = option.price / option.quantity,
        percent: string = ((1 - daily) * 100).toFixed(0);

      return (
        <h1 className="game-day-purchase-option-discount-label passion-one-font">
          {percent}% less per day!
        </h1>
      )
    }
  }

  const getRecommendationStatement = (): JSX.Element => {
    if(option.unit === GameDayPurchaseOptionUnit.Five) {
      return (
        <h1 className="game-day-purchase-option-recommendation-statement passion-one-font">Recommended for new players!</h1>
      )
    }
  }

  return (   
    <Button
      className={classNames("game-day-purchase-option", { "presentation-mode": props.presentationMode })}     
      disabled={props.handleOnClick === undefined}
      styles={{ backgroundImage: `url(${GameDayUtility.getGraphic(option.unit)})` }}
      handleOnClick={getHandleOnClick()} 
    >      
      <div className="game-day-purchase-option-content">
        {getDiscountLabel()}
        <div className="game-day-purchase-option-details">
          <h1 className="game-day-purchase-option-label passion-one-font">{option.label} ({option.quantity})</h1>
          <h1 className="game-day-purchase-option-daily-price passion-one-font">${daily.toFixed(2)} / Day</h1>
          {getRecommendationStatement()}
        <h1 className="game-day-purchase-option-price passion-one-font">${option.price}</h1>
        </div>
      </div>
    </Button>
  );
}