import React, { createContext, useState } from "react";

import { GameDayPaymentForm } from "../gameDayPaymentForm/gameDayPaymentForm";
import { GameDayPurchaseOption } from "../gameDayPurchaseOption/gameDayPurchaseOption";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { GameDayUtility } from "../../../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../../../stroll-models/gameDayPurchaseOption";
import { defaultGameDayPurchaseState, IGameDayPurchaseState } from "../../models/gameDayPurchaseState";

import { FormStatus } from "../../../../enums/formStatus";
import { GameDayPurchaseOptionUnit } from "../../../../../stroll-enums/gameDayPurchaseOptionUnit";

interface IGameDayPurchaseContext {
  state: IGameDayPurchaseState;
  setState: (state: IGameDayPurchaseState) => void;
}

export const GameDayPurchaseContext = createContext<IGameDayPurchaseContext>(null);

interface GameDayPurchaseModalProps {  
  option: IGameDayPurchaseOption;
  back: () => void;
}

export const GameDayPurchaseModal: React.FC<GameDayPurchaseModalProps> = (props: GameDayPurchaseModalProps) => {    
  const [state, setState] = useState<IGameDayPurchaseState>(defaultGameDayPurchaseState());

  const handleBack = (): void => {
    if(state.status === FormStatus.SubmitSuccess) {
      window.close();
      
      setTimeout(() => props.back(), 10);
    } else {
      props.back();
    }
  }

  return (
    <GameDayPurchaseContext.Provider value={{ state, setState }}>
      <Modal id="game-day-purchase-modal">
        <ModalTitle text="Purchase Game Days" handleOnClose={handleBack} />
        <ModalBody>       
          <GameDayPaymentForm 
            itemID={GameDayUtility.getGameDayPaymentItemID(props.option.unit)} 
            price={props.option.price}
            quantity={props.option.quantity}
          >
            <GameDayPurchaseOption 
              discount={props.option.unit !== GameDayPurchaseOptionUnit.One}
              option={props.option} 
              presentationMode 
            />
          </GameDayPaymentForm>
        </ModalBody>
      </Modal>
    </GameDayPurchaseContext.Provider>
  );
}