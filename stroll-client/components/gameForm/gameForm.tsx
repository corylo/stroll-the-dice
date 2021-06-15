import React, { useReducer } from "react";

import { Button } from "../buttons/button";
import { Form } from "../form/form";
import { FormActions } from "../form/formActions";
import { FormBody } from "../form/formBody";
import { InputWrapper } from "../inputWrapper/inputWrapper";

import { gameFormReducer } from "./reducers/gameFormReducer";

import { GameFormValidator } from "./validators/gameFormValidator";

import { GameFormUtility } from "./utilities/gameFormUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameFormStateFields } from "./models/gameFormStateFields";

import { FormStatus } from "../../enums/formStatus";
import { GameFormAction } from "./enums/gameFormAction";

interface GameFormProps {  
  game?: IGame;
  save: (fields: IGameFormStateFields) => Promise<void>;
}

export const GameForm: React.FC<GameFormProps> = (props: GameFormProps) => { 
  const [gameFormState, dispatchToGameForm] = useReducer(gameFormReducer, GameFormUtility.mapInitialState(props.game));

  const { errors, fields, status } = gameFormState;

  const dispatch = (type: GameFormAction, payload?: any): void => dispatchToGameForm({ type, payload });

  const save = async (): Promise<void> => {
    if(status !== FormStatus.Submitting && GameFormValidator.validate(errors, fields, dispatch)) {
      try {
        dispatch(GameFormAction.SetStatus, FormStatus.Submitting);

        await props.save(fields);

        dispatch(GameFormAction.SetStatus, FormStatus.SubmitSuccess);
      } catch (err) {
        console.error(err);

        dispatch(GameFormAction.SetStatus, FormStatus.SubmitError);
      }
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      save();
    }
  }

  const getStatusMessage = (): string => {
    if(status === FormStatus.SubmitSuccess) {
      return "Game saved successfully!";
    } else if(status === FormStatus.SubmitError) {
      return "There was an issue saving your game. Please refresh and try again!";
    }
  }

  return (
    <Form     
      errors={errors}
      id="game-form"
      status={status}
      statusMessage={getStatusMessage()}
    >
      <FormBody>
        <InputWrapper
          id="game-name-input" 
          label="Name" 
          maxLength={100}
          value={fields.name}
          error={errors.name}
        >
          <input 
            type="text"
            className="passion-one-font"
            maxLength={100}
            placeholder="Name"
            value={fields.name}
            onChange={(e: any) => dispatch(GameFormAction.SetName, e.target.value)}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
      </FormBody>
      <FormActions>
        <Button
          id="save-game-button" 
          className="submit-button fancy-button passion-one-font" 
          handleOnClick={save}
        >
          Save
        </Button>
      </FormActions>
    </Form>
  );
}