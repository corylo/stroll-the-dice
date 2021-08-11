import React, { createContext, useEffect, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { GameDayPurchaseOption } from "../gameDayPurchaseOption/gameDayPurchaseOption";
import { Modal } from "../../../../components/modal/modal";
import { ModalActions } from "../../../../components/modal/modalActions";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";

import { PaymentService } from "../../../../services/paymentService";

import { GameDayUtility } from "../../../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../../../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../../../../../stroll-enums/gameDayPurchaseOptionUnit";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGameDayPurchaseState {
  status: RequestStatus;
  url: string;
}

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
  const [state, setState] = useState<IGameDayPurchaseState>({ status: RequestStatus.Loading, url: "" });

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const url: string = await PaymentService.createPaymentSession({ 
        itemID: GameDayUtility.getGameDayPaymentItemID(props.option.unit), 
        quantity: 1 
      });

      setState({ status: RequestStatus.Success, url });
    }

    fetch();
  }, []);

  return (
    <GameDayPurchaseContext.Provider value={{ state, setState }}>
      <Modal id="game-day-purchase-modal" status={state.status}>
        <ModalTitle text="Purchase Game Days" handleOnClose={props.back} />
        <ModalBody>       
          <GameDayPurchaseOption 
            discount={props.option.unit !== GameDayPurchaseOptionUnit.Two}
            option={props.option} 
            presentationMode 
          />
        </ModalBody>
        <ModalActions>
          <Button
            className="submit-button fancy-button passion-one-font" 
            external
            url={state.url}
          >
            Checkout
          </Button>
        </ModalActions>
      </Modal>
    </GameDayPurchaseContext.Provider>
  );
}