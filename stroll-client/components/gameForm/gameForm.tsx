import React, { useContext, useEffect, useReducer } from "react";

import { Button } from "../buttons/button";
import { DurationSelector } from "./components/durationSelector/durationSelector";
import { Form } from "../form/form";
import { FormActions } from "../form/formActions";
import { FormBody } from "../form/formBody";
import { FormBodySection } from "../form/formBodySection";
import { FormTitle } from "../form/formTitle";
import { HourSelector } from "./components/hourSelector/hourSelector";
import { InputToggle } from "../inputToggle/inputToggle";
import { InputWrapper } from "../inputWrapper/inputWrapper";
import { LockGame } from "./components/lockGame/lockGame";
import { ModeSelector } from "./components/modeSelector/modeSelector";

import { AppContext } from "../app/contexts/appContext";

import { gameFormReducer } from "./reducers/gameFormReducer";

import { GameFormValidator } from "./validators/gameFormValidator";

import { DomUtility } from "../../utilities/domUtility";
import { GameFormUtility } from "./utilities/gameFormUtility";

import { IGame } from "../../../stroll-models/game";
import { IGameFormStateFields } from "./models/gameFormStateFields";

import { ElementID } from "../../enums/elementId";
import { FormError } from "../../enums/formError";
import { FormStatus } from "../../enums/formStatus";
import { GameDuration } from "../../../stroll-enums/gameDuration";
import { GameFormAction } from "./enums/gameFormAction";
import { GameMode } from "../../../stroll-enums/gameMode";
import { GameStatus } from "../../../stroll-enums/gameStatus";

interface GameFormProps {  
  forwarding?: boolean;
  game?: IGame;
  gameStatus?: GameStatus;
  title?: string;
  back?: () => void;
  save: (fields: IGameFormStateFields) => Promise<void>;
}

export const GameForm: React.FC<GameFormProps> = (props: GameFormProps) => { 
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [gameFormState, dispatchToGameForm] = useReducer(gameFormReducer, GameFormUtility.mapInitialState(props.game));

  const { errors, fields, status } = gameFormState;

  const dispatch = (type: GameFormAction, payload?: any): void => dispatchToGameForm({ type, payload });

  useEffect(() => {
    if(status !== FormStatus.InProgress && GameFormUtility.hasChanged(props.game, fields)) {
      dispatch(GameFormAction.SetStatus, FormStatus.InProgress);
    }
  }, [fields]);

  const save = async (): Promise<void> => {
    if(
      GameFormUtility.isValidGameStatus(props.gameStatus) &&
      status !== FormStatus.Submitting && 
      GameFormValidator.validate(errors, fields, dispatch)
    ) {
      try {
        dispatch(GameFormAction.SetStatus, FormStatus.Submitting);

        await props.save(fields);

        if(!props.forwarding) {
          dispatch(GameFormAction.SetStatus, FormStatus.SubmitSuccess);
        }
      } catch (err) {
        console.error(err);

        dispatch(GameFormAction.SetStatus, FormStatus.SubmitError);
      }

      DomUtility.scrollToBottom(ElementID.UpdateGameModal);
    }
  }

  const handleOnChange = (type: GameFormAction, payload?: any): void => {
    if(GameFormUtility.isValidGameStatus(props.gameStatus)) {
      dispatch(type, payload);
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      save();
    }
  }

  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (
        <FormTitle text={props.title} />
      )
    }
  }

  const getLockGameSection = (): JSX.Element => {
    if(props.game) {
      return (
        <LockGame 
          locked={fields.locked}
          toggle={(locked: boolean) => handleOnChange(GameFormAction.SetLocked, locked)} 
        />
      )
    }
  }

  const updateNotAllowedMessage = (): JSX.Element => {
    if(!GameFormUtility.isValidGameStatus(props.gameStatus)) {
      return (
        <FormBodySection>
          <h1 className="update-not-allowed-message passion-one-font">This game's start date has already passed and so it can no longer be updated.</h1>
        </FormBodySection>
      )
    }
  }

  const getStatusMessage = (): string => {
    if(status === FormStatus.SubmitSuccess) {
      return "Game saved successfully!";
    } else if(status === FormStatus.SubmitError) {
      return "There was an issue saving your game. Please refresh and try again!";
    }
  }

  const getSaveButton = (): JSX.Element => {
    if(GameFormUtility.hasChanged(props.game, fields)) {
      return (      
        <Button
          className="submit-button fancy-button passion-one-font" 
          handleOnClick={save}
        >
          Save
        </Button>
      )
    }
  }

  const getBackButton = (): JSX.Element => {
    if(props.game && props.back) {
      return (        
        <Button
          className="submit-button fancy-button passion-one-font" 
          handleOnClick={props.back}
        >
          Back
        </Button>
      )
    }
  }

  const getStartDateErrorMessage = (): string => {
    if(errors.startsAt === FormError.InvalidValue) {
      return FormError.InvalidValue;
    } else if (errors.startsAt === FormError.UpperLimitExceeded) {
      return "Date must be within 30 days of today."
    } else if (errors.startsAt === FormError.LowerLimitExceeded) {
      return "Date must be in the future."
    }
  }
  
  const getStartTimeErrorMessage = (): string => {
    if (errors.startsAtHour === FormError.LowerLimitExceeded) {
      return "Time must be in the future."
    }
  }
  
  return (
    <Form     
      errors={errors}
      id="game-form"
      status={status}
      statusMessage={getStatusMessage()}
    >
      {getTitle()}
      <FormBody>
        {updateNotAllowedMessage()}
        <InputWrapper
          id="game-name-input" 
          label="Name" 
          maxLength={50}
          value={fields.name}
          error={errors.name}
        >
          <input 
            type="text"
            className="passion-one-font"
            maxLength={50}
            placeholder="Name"
            value={fields.name}
            onChange={(e: any) => handleOnChange(GameFormAction.SetName, e.target.value)}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
        <InputWrapper
          label="Duration"
          error={errors.duration}
        >
          <DurationSelector
            disabled={props.game !== undefined}
            selected={fields.duration}
            select={(duration: GameDuration) => handleOnChange(GameFormAction.SetDuration, duration)} 
          />
        </InputWrapper>
        <InputWrapper
          label="Mode"
          error={errors.mode}
        >
          <ModeSelector
            disabled={props.game !== undefined}
            selected={fields.mode}
            select={(mode: GameMode) => handleOnChange(GameFormAction.SetMode, mode)} 
          />
        </InputWrapper>
        <FormBodySection className="start-date-section">
          <InputWrapper
            label="Start Date"
            error={errors.startsAt}
            errorMessage={getStartDateErrorMessage()}
          >
            <input 
              type="date" 
              className="passion-one-font"
              value={fields.startsAt}
              onChange={(e: any) => handleOnChange(GameFormAction.SetStartsAt, e.target.value)}
            />
          </InputWrapper>
          <InputWrapper
            label="Start Time"
            error={errors.startsAtHour}
            errorMessage={getStartTimeErrorMessage()}
          >
            <HourSelector hour={fields.startsAtHour} select={(hour: number) => handleOnChange(GameFormAction.SetStartsAtHour, hour)} />
          </InputWrapper>
        </FormBodySection>
        {getLockGameSection()}
      </FormBody>
      <FormActions>
        {getSaveButton()}
        {getBackButton()}
      </FormActions>
    </Form>
  );
}