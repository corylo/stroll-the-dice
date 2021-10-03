import React, { useEffect, useState } from "react";

import { AdminSection } from "../adminSection/adminSection";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { FormError } from "../../../../enums/formError";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTrackerService } from "../../../../services/stepTrackerService";

interface IDisconnectStepTrackerSectionState {  
  id: string;
  idError: FormError;
  status: RequestStatus;
}

const defaultDisconnectStepTrackerSectionState = (): IDisconnectStepTrackerSectionState => ({
  id: "", 
  idError: FormError.None, 
  status: RequestStatus.Idle
});

interface DisconnectStepTrackerSectionProps {  
  
}

export const DisconnectStepTrackerSection: React.FC<DisconnectStepTrackerSectionProps> = (props: DisconnectStepTrackerSectionProps) => {  
  const [state, setState] = useState<IDisconnectStepTrackerSectionState>(defaultDisconnectStepTrackerSectionState());

  const updateID = (id: string): void => setState({ ...state, id });

  const validate = (): boolean => {
    const updatedState: IDisconnectStepTrackerSectionState = { ...state };

    let errorCount: number = 0;

    if(state.id.trim() === "") {
      updatedState.idError = FormError.InvalidValue;
      errorCount++;
    }

    setState(updatedState);

    return errorCount === 0;
  }

  useEffect(() => {
    if(state.idError === FormError.InvalidValue && state.id.trim() !== "") {
      setState({ ...state, idError: FormError.None });
    }
  }, [state]);

  const go = async (): Promise<void> => {
    if(validate() && state.status !== RequestStatus.Loading) {
      try {
        setState({ ...state, status: RequestStatus.Loading });

        await StepTrackerService.disconnect({ friendID: state.id });
        
        setState(defaultDisconnectStepTrackerSectionState());
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
    <AdminSection className="disconnect-step-tracker-section" status={state.status} title="Disconnect Step Tracker">
      <div className="admin-section-form">
        <div className="admin-section-inputs">
          <InputWrapper
            id="disconnect-step-tracker-id-input" 
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