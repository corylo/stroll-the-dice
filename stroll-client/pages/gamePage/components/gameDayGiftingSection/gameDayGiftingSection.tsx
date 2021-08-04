import React, { useContext, useState } from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { FormBodySection } from "../../../../components/form/formBodySection";
import { PlayerStatement } from "../../../../components/playerStatement/playerStatement";

import { GamePageContext } from "../../gamePage";

interface GameDayGiftingSectionProps {  
  acceptingGift: boolean;
  setAcceptingGiftTo: (acceptingGift: boolean) => void;
}

export const GameDayGiftingSection: React.FC<GameDayGiftingSectionProps> = (props: GameDayGiftingSectionProps) => {  
  const { state } = useContext(GamePageContext);

  const { acceptingGift, setAcceptingGiftTo } = props;

  if(state.game.useMyGameDaysForJoiningPlayers) {
    const getClasses = (selected: boolean): string => {
      return classNames(
        "game-day-gifting-acceptance-option", 
        "fancy-option-button", 
        { selected }
      );
    }

    return (
      <FormBodySection className="game-day-gifting-section">
        <div className="game-day-gifting-section-header">
          <i className="game-day-gifting-section-header-icon fal fa-gift" />
          <div className="game-day-gifting-section-header-text">
            <h1 className="game-day-gifting-section-title passion-one-font">You're in luck!</h1>
            <h1 className="game-day-gifting-section-sub-title passion-one-font"><PlayerStatement profile={state.game.creator} /> is gifting their Game Days so you can join for free.</h1>
          </div>
        </div>
        <div className="game-day-gifting-section-body">
          <Button 
            className={getClasses(acceptingGift)}                     
            handleOnClick={() => setAcceptingGiftTo(true)} 
          >
            {acceptingGift ? <i className="far fa-check" /> : null}
            <h1 className="passion-one-font">Sounds good!</h1>
          </Button>
          <Button 
            className={getClasses(!acceptingGift)}                     
            handleOnClick={() => setAcceptingGiftTo(false)} 
          >
            {!acceptingGift ? <i className="far fa-check" /> : null}
            <h1 className="passion-one-font">I'll use my own instead, thanks.</h1>
          </Button>
        </div>
      </FormBodySection>
    )
  }

  return null;
}