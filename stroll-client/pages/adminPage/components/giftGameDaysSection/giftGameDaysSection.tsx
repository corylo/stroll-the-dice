import React, { useEffect, useState } from "react";

import { GameDayService } from "../../../../services/gameDayService";

import { AdminSection } from "../adminSection/adminSection";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { FormError } from "../../../../enums/formError";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";

interface IGiftGameDaysSectionState {  
  id: string;
  idError: FormError;
  quantity: string;
  quantityError: FormError;
  status: RequestStatus;
}

const defaultGiftGameDaysSectionState = (): IGiftGameDaysSectionState => ({
  id: "", 
  idError: FormError.None,     
  quantity: "",
  quantityError: FormError.None,
  status: RequestStatus.Idle
});

interface GiftGameDaysSectionProps {  
  
}

export const GiftGameDaysSection: React.FC<GiftGameDaysSectionProps> = (props: GiftGameDaysSectionProps) => {  
  const [state, setState] = useState<IGiftGameDaysSectionState>(defaultGiftGameDaysSectionState());

  const updateID = (id: string): void => setState({ ...state, id });

  const updateQuantity = (quantity: string): void => {
    setState({ ...state, quantity });
  };

  const validate = (): boolean => {
    const updatedState: IGiftGameDaysSectionState = { ...state };

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
        
        setState(defaultGiftGameDaysSectionState());
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
        <h1 className="admin-section-error-message passion-one-font">Invalid permissions or user does not exist.</h1>
      )
    }
  }

  return (    
    <AdminSection className="gift-game-days-section" status={state.status} title="Gift Game Days">
      <div className="admin-section-form">
        <div className="admin-section-inputs">
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
          className="admin-section-submit-button"
          icon={state.status === RequestStatus.Loading ? "fal fa-spinner-third" : "fal fa-arrow-right"}
          handleOnClick={go}
        />
      </div>
      {getErrorMessage()}
    </AdminSection>
  )
}