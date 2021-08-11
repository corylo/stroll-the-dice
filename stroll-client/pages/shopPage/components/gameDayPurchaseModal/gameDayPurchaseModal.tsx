import React, { useEffect, useState } from "react";

import { Button } from "../../../../components/buttons/button";
import { GameDayPurchaseOption } from "../gameDayPurchaseOption/gameDayPurchaseOption";
import { Modal } from "../../../../components/modal/modal";
import { ModalActions } from "../../../../components/modal/modalActions";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { PoweredByStripe } from "../../../../components/poweredByStripe/poweredByStripe";

import { PaymentService } from "../../../../services/paymentService";

import { GameDayUtility } from "../../../../../stroll-utilities/gameDayUtility";

import { IGameDayPurchaseOption } from "../../../../../stroll-models/gameDayPurchaseOption";

import { GameDayPurchaseOptionUnit } from "../../../../../stroll-enums/gameDayPurchaseOptionUnit";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { ModalStatusMessage } from "../../../../components/modal/modalStatusMessage";

interface IGameDayPurchaseState {
  status: RequestStatus;
}

interface GameDayPurchaseModalProps {  
  completionStatus: RequestStatus;
  option: IGameDayPurchaseOption;
  back: () => void;
}

export const GameDayPurchaseModal: React.FC<GameDayPurchaseModalProps> = (props: GameDayPurchaseModalProps) => {    
  const [state, setState] = useState<IGameDayPurchaseState>({ status: RequestStatus.Idle });

  const handleOnCheckout = async (): Promise<void> => {
    try {
      setState({ ...state, status: RequestStatus.Loading });

      const url: string = await PaymentService.createPaymentSession({ 
        itemID: GameDayUtility.getGameDayPaymentItemID(props.option.unit), 
        quantity: 1 
      });

      window.location.href = url;
    } catch (err) {
      setState({ ...state, status: RequestStatus.Idle });
    }
  }

  const getContent = (): JSX.Element => {
    if(props.completionStatus === RequestStatus.Idle) {
      return (
        <PoweredByStripe />
      )
    } else if (props.completionStatus === RequestStatus.Success) {
      return (
        <ModalStatusMessage 
          status={RequestStatus.Success} 
          statusMessage="Purchase complete! If you opened the shop in a new tab, you may now close it."
        />
      )
    } else if (props.completionStatus === RequestStatus.Error) {
      return (
        <ModalStatusMessage 
          status={RequestStatus.Error} 
          statusMessage="Purchase cancelled! You may now close this modal."
        />
      )
    }
  }

  const getActions = (): JSX.Element => {
    if(props.completionStatus === RequestStatus.Idle) {
      return (
        <ModalActions>
          <Button
            className="submit-button fancy-button passion-one-font" 
            handleOnClick={handleOnCheckout}
          >
            Checkout
          </Button>
        </ModalActions>
      )
    }
  }

  return (
    <Modal id="game-day-purchase-modal" status={state.status}>
      <ModalTitle text="Purchase Game Days" handleOnClose={props.back} />
      <ModalBody>       
        <GameDayPurchaseOption 
          discount={props.option.unit !== GameDayPurchaseOptionUnit.Two}
          option={props.option} 
          presentationMode 
        />
        {getContent()}
      </ModalBody>
      {getActions()}
    </Modal>
  );
}