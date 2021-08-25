import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { GameDayService } from "../../../../services/gameDayService";

import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { FormError } from "../../../../enums/formError";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGiftGameDaysInputState {  
  id: string;
  idError: FormError;
  quantity: string;
  quantityError: FormError;
  status: RequestStatus;
}

const defaultGiftGameDaysInputState = (): IGiftGameDaysInputState => ({
  id: "", 
  idError: FormError.None,     
  quantity: "",
  quantityError: FormError.None,
  status: RequestStatus.Idle
});

interface GiftGameDaysInputProps {  
  
}

export const GiftGameDaysInput: React.FC<GiftGameDaysInputProps> = (props: GiftGameDaysInputProps) => {  
  const [state, setState] = useState<IGiftGameDaysInputState>(defaultGiftGameDaysInputState());

  const updateID = (id: string): void => setState({ ...state, id });

  const updateQuantity = (quantity: string): void => {
    setState({ ...state, quantity });
  };

  const validate = (): boolean => {
    const updatedState: IGiftGameDaysInputState = { ...state };

    let errorCount: number = 0;

    if(state.id.trim() === "") {
      updatedState.idError = FormError.InvalidValue;
      errorCount++;
    }

    if(state.quantity === "" || parseInt(state.quantity) === 0) {
      updatedState.quantityError = FormError.InvalidValue;
      errorCount++;
    }

    setState(updatedState);

    return errorCount === 0;
  }

  useEffect(() => {
    if(state.idError === FormError.InvalidValue && state.id.trim() !== "") {
      setState({ ...state, idError: FormError.None });
    }
    
    if(state.quantityError === FormError.InvalidValue && state.quantity !== "" && parseInt(state.quantity) > 0) {
      setState({ ...state, quantityError: FormError.None });
    }
  }, [state]);

  const go = async (): Promise<void> => {
    if(validate() && state.status === RequestStatus.Idle) {
      try {
        setState({ ...state, status: RequestStatus.Loading });

        await GameDayService.gift({ id: state.id, quantity: parseInt(state.quantity) });
        
        setState(defaultGiftGameDaysInputState());
      } catch (err) {
        console.error(err);

        setState({ ...state, status: RequestStatus.Error });
      }
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      go();
    }
  }

  const getErrorMessage = (): JSX.Element => {
    if(state.status === RequestStatus.Error) {
      return (
        <h1 className="gift-game-days-error-message passion-one-font">Invalid permissions or user does not exist.</h1>
      )
    }
  }

  return (    
    <div id="gift-game-days-wrapper" className={classNames({ loading: state.status === RequestStatus.Loading })}>
      <div id="gift-game-days-form">
        <div id="gift-game-days-inputs">
          <InputWrapper
            id="gift-game-days-id-input" 
            label="User ID"
            value={state.id}
            error={state.idError}
            errorMessage="Invalid ID"
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === RequestStatus.Loading}
              placeholder="Enter ID"
              value={state.id}
              onChange={(e: any) => updateID(e.target.value)}
              onKeyDown={handleOnKeyDown}
            />
          </InputWrapper>
          <InputWrapper
            id="gift-game-days-quantity-input" 
            label="Quantity"
            value={state.quantity.toString()}
            error={state.quantityError}
            errorMessage="Invalid Quantity"
          >
            <input 
              type="text"
              className="passion-one-font"
              disabled={state.status === RequestStatus.Loading}
              placeholder="Enter quantity"
              value={state.quantity}
              onChange={(e: any) => updateQuantity(e.target.value.replace(/\D/g,""))}
              onKeyDown={handleOnKeyDown}
            />
          </InputWrapper>
        </div>
        <IconButton
          id="gift-game-days-input-button"
          icon={state.status === RequestStatus.Loading ? "fal fa-spinner-third" : "fal fa-arrow-right"}
          handleOnClick={go}
        />
      </div>
      {getErrorMessage()}
    </div>
  )
}