import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { GameDayService } from "../../../../services/gameDayService";

import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { FormError } from "../../../../enums/formError";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGiftGameDaysInputState {  
  email: string;
  emailError: FormError;
  quantity: number;
  quantityError: FormError;
  status: RequestStatus;
}

const defaultGiftGameDaysInputState = (): IGiftGameDaysInputState => ({
  email: "", 
  emailError: FormError.None,     
  quantity: 0,
  quantityError: FormError.None,
  status: RequestStatus.Idle
});

interface GiftGameDaysInputProps {  
  
}

export const GiftGameDaysInput: React.FC<GiftGameDaysInputProps> = (props: GiftGameDaysInputProps) => {  
  const [state, setState] = useState<IGiftGameDaysInputState>(defaultGiftGameDaysInputState());

  const updateEmail = (email: string): void => setState({ ...state, email });

  const updateQuantity = (quantity: string): void => {
    const quantityString: string = quantity.replace(/\D/g,"");

    let updatedQuantity: number = 0;

    if(quantityString !== "") {
      updatedQuantity = parseInt(quantityString);
    }

    setState({ ...state, quantity: updatedQuantity });
  };

  const validate = (): boolean => {
    const updatedState: IGiftGameDaysInputState = { ...state };

    let errorCount: number = 0;

    if(state.email.trim() === "") {
      updatedState.emailError = FormError.InvalidValue;
      errorCount++;
    }

    if(state.quantity === 0) {
      updatedState.quantityError = FormError.InvalidValue;
      errorCount++;
    }

    setState(updatedState);

    return errorCount === 0;
  }

  useEffect(() => {
    if(state.emailError === FormError.InvalidValue && state.email.trim() !== "") {
      setState({ ...state, emailError: FormError.None });
    }
    
    if(state.quantityError === FormError.InvalidValue && state.quantity > 0) {
      setState({ ...state, quantityError: FormError.None });
    }
  }, [state]);

  const go = async (): Promise<void> => {
    if(validate() && state.status === RequestStatus.Idle) {
      try {
        setState({ ...state, status: RequestStatus.Loading });

        await GameDayService.gift({ email: state.email, quantity: state.quantity });
        
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

  return (    
    <div id="gift-game-days-wrapper" className={classNames({ loading: state.status === RequestStatus.Loading })}>
      <div id="gift-game-days-inputs">
        <InputWrapper
          id="gift-game-days-email-input" 
          label="User Email"
          value={state.email}
          error={state.emailError}
          errorMessage="Invalid Email"
        >
          <input 
            type="text"
            className="passion-one-font"
            disabled={state.status === RequestStatus.Loading}
            placeholder="Enter email"
            value={state.email}
            onChange={(e: any) => updateEmail(e.target.value)}
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
            onChange={(e: any) => updateQuantity(e.target.value)}
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
  )
}