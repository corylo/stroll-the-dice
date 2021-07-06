import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";

import { GamePageContext } from "../../gamePage";

import { PredictionService } from "../../../../services/predictionService";

import { PredictionValidator } from "../../validators/predictionValidator";

import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { IMatchup } from "../../../../../stroll-models/matchup";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IPredictionUpdate } from "../../../../../stroll-models/predictionUpdate";

import { FormError } from "../../../../enums/formError";
import { FormStatus } from "../../../../enums/formStatus";

export interface IMatchupSidePredictionState {
  amount: string;
  error: FormError;
  status: FormStatus;
}

interface MatchupSidePredictionProps {  
  matchup: IMatchup;
  myPrediction: IPrediction;
  playerID: string;
}

export const MatchupSidePrediction: React.FC<MatchupSidePredictionProps> = (props: MatchupSidePredictionProps) => {   
  const { game, player } = useContext(GamePageContext).state;
  
  const { matchup, myPrediction, playerID } = props;

  const enabled: boolean = PredictionUtility.enabled(playerID, myPrediction);

  const [state, setState] = useState<IMatchupSidePredictionState>({ 
    amount: "", 
    error: FormError.None,
    status: FormStatus.InProgress 
  });

  useEffect(() => {
    if(player && parseInt(state.amount) <= player.points.available) {
      setState({ ...state, error: FormError.None });
    }
  }, [player, state.amount]);

  const updateAmount = (e: any): void => {
    if(enabled) {
      setState({ ...state, amount: e.target.value.replace(/\D/g, "") });
    }
  }

  const updateStatus = (status: FormStatus): void => {
    setState({ ...state, status });
  }

  const submit = async (): Promise<void> => {
    if(
      enabled &&
      state.status !== FormStatus.Submitting && 
      PredictionValidator.validate(player.points.available, state, setState)
    ) {
      try {
        updateStatus(FormStatus.Submitting);

        const amount: number = parseInt(state.amount);

        if(myPrediction) {
          const update: IPredictionUpdate = PredictionUtility.mapUpdate(amount, myPrediction);

          await PredictionService.update(myPrediction, update);
        } else {
          const prediction: IPrediction = PredictionUtility.mapCreate(
            amount, 
            player.id,
            game.id,
            matchup.id,
            playerID
          );

          await PredictionService.create(prediction);
        }

        setState({ ...state, status: FormStatus.SubmitSuccess, amount: "" });       
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
            disabled={state.status === FormStatus.Submitting || !enabled}
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