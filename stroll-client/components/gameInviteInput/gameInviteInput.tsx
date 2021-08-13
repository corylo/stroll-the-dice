import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { InputWrapper } from "../inputWrapper/inputWrapper";

import { FormError } from "../../enums/formError";
import { IconButton } from "../buttons/iconButton";
import { AppContext } from "../app/contexts/appContext";
import { RoleUtility } from "../../../stroll-utilities/roleUtility";

interface IGameInviteInputState {
  error: FormError;
  value: string;
}

interface GameInviteInputProps {  
  
}

export const GameInviteInput: React.FC<GameInviteInputProps> = (props: GameInviteInputProps) => {  
  const { user } = useContext(AppContext).appState;

  const [state, setState] = useState<IGameInviteInputState>({ error: FormError.None, value: "" });

  const updateValue = (value: string): void => setState({ ...state, value });

  const history: any = useHistory();

  const validate = (): boolean => {
    const isValid = (): boolean => {
      if(RoleUtility.isAdmin(user.roles)) {
        return true;
      }
  
      const formattedValue: string = state.value.trim(),
        hasOrigin: boolean = state.value.indexOf(window.location.origin) === 0,
        hasGameParam: boolean = state.value.indexOf("/game/") > window.location.origin.length - 1,
        hasInviteParam: boolean = state.value.indexOf("?invite=") > window.location.origin.length - 1;
  
      return (
        formattedValue !== "" &&
        hasOrigin &&
        hasGameParam &&
        hasInviteParam
      )
    }
  
    if(isValid()) {
      return true;
    }

    setState({ ...state, error: FormError.InvalidValue });

    return false;
  }

  useEffect(() => {
    if(state.error === FormError.InvalidValue && validate()) {
      setState({ ...state, error: FormError.None });
    }
  }, [state.value, state.error]);

  const go = (): void => {
    if(validate()) {
      const getPath = (): string => {
        if(RoleUtility.isAdmin(user.roles)) {
          return `/game/${state.value}`;
        }

        return state.value.split(window.location.origin)[1];
      }

      history.push(getPath());
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      go();
    }
  }

  return (
    <div id="game-invite-input-wrapper">
      <InputWrapper
        id="game-invite-input" 
        label="Game Invite" 
        value={state.value}
        error={state.error}
        errorMessage="Invalid Link"
      >
        <input 
          type="text"
          className="passion-one-font"
          placeholder="Enter invite link"
          value={state.value}
          onChange={(e: any) => updateValue(e.target.value)}
          onKeyDown={handleOnKeyDown}
        />
      </InputWrapper>
      <IconButton
        id="game-invite-input-button"
        icon="fal fa-arrow-right"
        handleOnClick={go}
      />
    </div>
  );
}