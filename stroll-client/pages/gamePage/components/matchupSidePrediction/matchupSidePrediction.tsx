import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { GamePageContext } from "../../gamePage";

import { PredictionService } from "../../../../services/predictionService";

import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IPrediction } from "../../../../../stroll-models/prediction";

import { FormStatus } from "../../../../enums/formStatus";
import { FormError } from "../../../../enums/formError";
import { PredictionValidator } from "../../validators/predictionValidator";

export interface IMatchupSidePredictionState {
  amount: string;
  error: FormError;
  status: FormStatus;
}

interface MatchupSidePredictionProps {  
  matchupID: string;
  playerID: string;
}

export const MatchupSidePrediction: React.FC<MatchupSidePredictionProps> = (props: MatchupSidePredictionProps) => {   
  const { game, player } = useContext(GamePageContext).state;
  
  const { matchupID, playerID } = props;

  const [state, setState] = useState<IMatchupSidePredictionState>({ 
    amount: "", 
    error: FormError.None,
    status: FormStatus.SubmitSuccess 
  });

  useEffect(() => {
    if(player && parseInt(state.amount) <= player.funds) {
      setState({ ...state, error: FormError.None });
    }
  }, [player, state.amount]);

  const updateAmount = (e: any): void => {
    setState({ ...state, amount: e.target.value.replace(/\D/g, "") });
  }

  const updateStatus = (status: FormStatus): void => {
    setState({ ...state, status });
  }

  const submit = async (): Promise<void> => {
    if(state.status !== FormStatus.Submitting && PredictionValidator.validate(player.funds, state, setState)) {
      try {
        updateStatus(FormStatus.Submitting);

        const prediction: IPrediction = PredictionUtility.mapCreate(
          parseInt(state.amount), 
          player.id,
          game.id,
          matchupID,
          playerID
        );

        await PredictionService.create(player.id, prediction);

        updateStatus(FormStatus.SubmitSuccess);
      } catch (err) {
        console.error(err);

        updateStatus(FormStatus.SubmitError);
      }
    }
  }
   
  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      submit();
    }
  }
  
  const getSubmitIcon = (): string => {
    if(state.status === FormStatus.Submitting) {
      return "fal fa-spinner-third";
    }

    return "fal fa-check";
  }

  const getError = (): FormError => {
    if(state.status === FormStatus.SubmitError) {
      return FormError.InvalidValue;
    }

    return state.error;
  }

  const getErrorMessage = (): string => {
    if(state.status === FormStatus.SubmitError) {
      return "Error";
    }

    return "Invalid";
  }

  return (
    <div className={classNames("game-matchup-side-prediction", { submitting: state.status === FormStatus.Submitting })}>
      <div className="game-matchup-side-input-wrapper">
        <InputWrapper label="Predict" error={getError()} errorMessage={getErrorMessage()}>
          <input 
            type="text"
            className="passion-one-font"
            disabled={state.status === FormStatus.Submitting}
            placeholder="0"
            value={state.amount}
            onChange={updateAmount}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
        <IconButton 
          className="game-matchup-side-prediction-button passion-one-font" 
          icon={getSubmitIcon()}
          handleOnClick={submit}
        />
      </div>
    </div>
  );
}