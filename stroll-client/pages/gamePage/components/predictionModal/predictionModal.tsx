import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";
import { MatchupSides } from "../matchupSides/matchupSides";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { MyPrediction } from "../myPrediction/myPrediction";

import { GamePageContext } from "../../gamePage";

import { PredictionService } from "../../../../services/predictionService";

import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { PredictionValidator } from "../../validators/predictionValidator";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";
import { defaultMatchupPredictionState, IMatchupPredictionState, IMatchupPredictionStateErrors } from "../../models/matchupPredictionState";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IPredictionUpdate } from "../../../../../stroll-models/predictionUpdate";

import { FormError } from "../../../../enums/formError";
import { FormStatus } from "../../../../enums/formStatus";

interface PredictionModalProps {  
  matchup: IMatchup;
  myPrediction: IPrediction;
  back: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = (props: PredictionModalProps) => {  
  const { game, player } = useContext(GamePageContext).state;

  const { matchup, myPrediction } = props;

  const predictionsClosed: boolean = !PredictionUtility.predictionsAvailableForDay(matchup, game.startsAt);

  const [state, setState] = useState<IMatchupPredictionState>({ 
    ...defaultMatchupPredictionState(),    
    playerID: myPrediction ? myPrediction.ref.player : ""
  });

  useEffect(() => {
    const hasChanged: boolean = (
      (state.status === FormStatus.SubmitSuccess && state.amount !== "")
    );

    if(state.status !== FormStatus.InProgress && hasChanged) {
      updateStatus(FormStatus.InProgress);
    }
  }, [state.status, state.amount, state.playerID]);
  
  const updateAmount = (e: any): void => {
    const amount: string = e.target.value.replace(/\D/g, "");

    const updatedErrors: IMatchupPredictionStateErrors = { ...state.errors };

    if(state.errors.amount && amount !== "" && parseInt(amount) !== 0) {
      updatedErrors.amount = FormError.None;
    }

    setState({ ...state, amount, errors: updatedErrors });
  }

  const selectPlayer = (playerID: string): void => {
    const updatedErrors: IMatchupPredictionStateErrors = { ...state.errors };

    if(state.errors.playerID && playerID !== "") {
      updatedErrors.playerID = FormError.None;
    }

    setState({ ...state, playerID, errors: updatedErrors });
  }

  const updateStatus = (status: FormStatus): void => {
    setState({ ...state, status });
  }

  const updateErrors = (errors: IMatchupPredictionStateErrors): void => {
    setState({ ...state, errors });
  }

  const submit = async (): Promise<void> => {
    if(
      state.status !== FormStatus.Submitting && 
      PredictionValidator.validate(player.points.available, state, updateErrors)
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
            state.playerID
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

  const getStatusMessage = (): string => {
    if(state.status === FormStatus.SubmitError) {
      return "There was an issue saving your prediction. Please refresh and try again!";
    }

    return "Prediction saved!";
  }

  const getMyPrediction = (): JSX.Element => {
    if(myPrediction) {      
      return (
        <MyPrediction 
          matchup={matchup} 
          myPrediction={myPrediction} 
        />
      )
    }
  }

  const getSelectionButton = (side: IMatchupSide): JSX.Element => {
    const selected: boolean = state.playerID === side.playerID;
    
    const styles: React.CSSProperties = selected 
        ? { backgroundColor: `rgba(${side.profile.color}, 0.1)`, borderColor: `rgb(${side.profile.color})` } 
        : null;

    return (      
      <IconButton
        className={classNames("prediction-player-selection-button", { selected: state.playerID === side.playerID })}
        disabled={!PredictionUtility.matchupSideAvailable(matchup, side, player, myPrediction) || predictionsClosed}
        styles={styles}
        icon="fal fa-check"
        handleOnClick={() => selectPlayer(side.playerID)}
      />
    )
  }

  return (
    <Modal id="prediction-modal" status={state.status}>
      <ModalTitle text="Predict Matchup" handleOnClose={props.back} />
      <ModalBody>
        <Form 
          id="prediction-form" 
          errors={state.errors} 
          status={state.status} 
          statusMessage={getStatusMessage()}
        >
          <FormBody>
            <MatchupSides matchup={matchup} />
            <InputWrapper 
              id="prediction-player-selection-wrapper"
              label="Pick A Side"
              error={state.errors.playerID} 
              errorMessage="Required"
            >
              {getSelectionButton(matchup.left)}
              {getSelectionButton(matchup.right)}
            </InputWrapper>            
            {getMyPrediction()}
            <InputWrapper 
              label={`${player.points.available.toLocaleString()} points available`}
              error={state.errors.amount} 
              errorMessage="Invalid Amount"
            >
              <input 
                type="text"
                className="passion-one-font"
                disabled={state.status === FormStatus.Submitting || predictionsClosed}
                placeholder="Enter amount"
                value={state.amount}
                onChange={updateAmount}
                onKeyDown={handleOnKeyDown}
              />
            </InputWrapper>
          </FormBody>
          <FormActions>
            <Button
              className="submit-button fancy-button passion-one-font" 
              disabled={predictionsClosed}
              handleOnClick={submit}
            >
              Predict!
            </Button>
          </FormActions>
        </Form>          
      </ModalBody>
    </Modal>
  );
}