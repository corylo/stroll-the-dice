import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import _cloneDeep from "lodash.clonedeep";

import { Button } from "../../../../components/buttons/button";
import { Form } from "../../../../components/form/form";
import { FormActions } from "../../../../components/form/formActions";
import { FormBody } from "../../../../components/form/formBody";
import { IconButton } from "../../../../components/buttons/iconButton";
import { InputWrapper } from "../../../../components/inputWrapper/inputWrapper";
import { MatchupSides } from "../matchupSides/matchupSides";
import { MatchupSpreadStatus } from "../matchupSpreadStatus/matchupSpreadStatus";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { MyPrediction } from "../myPrediction/myPrediction";
import { SimulatedPredictionOutcome } from "../simulatedPredictionOutcome/simulatedPredictionOutcome";

import { GamePageContext } from "../../gamePage";

import { PredictionService } from "../../../../services/predictionService";

import { DomUtility } from "../../../../utilities/domUtility";
import { PredictionUtility } from "../../../../utilities/predictionUtility";

import { PredictionValidator } from "../../validators/predictionValidator";

import { IMatchup, IMatchupSide } from "../../../../../stroll-models/matchup";
import { defaultMatchupPredictionState, IMatchupPredictionState, IMatchupPredictionStateErrors } from "../../models/matchupPredictionState";
import { IPrediction } from "../../../../../stroll-models/prediction";
import { IPredictionUpdate } from "../../../../../stroll-models/predictionUpdate";

import { ElementID } from "../../../../enums/elementId";
import { FormError } from "../../../../enums/formError";
import { FormStatus } from "../../../../enums/formStatus";
import { GameStatus } from "../../../../../stroll-enums/gameStatus";
import { PredictionConstraint } from "../../../../../stroll-enums/predictionConstraint";

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
    if(myPrediction && myPrediction.amount >= PredictionConstraint.CreationMinimum && state.minimum !== PredictionConstraint.UpdateMinimum) {
      setState({ ...state, minimum: PredictionConstraint.UpdateMinimum });
    }
  }, [myPrediction, state.minimum]);

  useEffect(() => {
    const hasChanged: boolean = (
      (state.status === FormStatus.SubmitSuccess && state.amount !== "")
    );

    if(state.status !== FormStatus.InProgress && hasChanged) {
      updateStatus(FormStatus.InProgress);
    }
  }, [state.status, state.amount, state.playerID]);
  
  const updateAmount = (e: any): void => {
    const amount: string = e.target.value.replace(/\D/g, ""),
      numericAmount: number = amount !== "" ? Math.min(parseInt(amount), player.points.available) : 0,
      finalizedAmount: string = numericAmount > 0 ? numericAmount.toString() : "";

    const updatedErrors: IMatchupPredictionStateErrors = { ...state.errors };

    if(
      (state.errors.amount === FormError.LowerLimitExceeded && amount !== "" && numericAmount >= state.minimum) ||
      (state.errors.amount === FormError.UpperLimitExceeded && amount !== "" && numericAmount <= player.points.available)
    ) {
      updatedErrors.amount = FormError.None;
    }

    setState({ 
      ...state, 
      amount: finalizedAmount, 
      errors: updatedErrors 
    });
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

        DomUtility.scrollToBottom(ElementID.PredictionModal);
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
    
    const styles: React.CSSProperties = {},
      borderStyles: React.CSSProperties = {};
    
    if(selected) {
      const borderColor: string = `rgb(${side.profile.color})`;

      borderStyles.background = `linear-gradient(to top, rgba(${side.profile.color}, 0.25), transparent)`;
      borderStyles.borderColor = borderColor;

      styles.backgroundColor = `rgba(${side.profile.color}, 0.1)`;
      styles.borderColor = borderColor;
    }

    const getText = (): JSX.Element => {
      if(selected) {
        return (
          <h1 className="passion-one-font" style={{ color: `rgb(${side.profile.color})` }}>Selected</h1>
        )
      }
    }

    return (      
      <div className={classNames("prediction-player-selection-button-wrapper", { selected: state.playerID === side.playerID })}>     
        <div className="prediction-player-selection-bracket" style={borderStyles}>
          {getText()}
        </div>
        <IconButton
          className={classNames("prediction-player-selection-button", { selected: state.playerID === side.playerID })}
          disabled={!PredictionUtility.matchupSideAvailable(matchup, side, player, myPrediction) || predictionsClosed}
          styles={styles}
          icon="fal fa-check"
          handleOnClick={() => selectPlayer(side.playerID)}
        />
      </div>
    )
  }

  const getAmountErrorMessage = (): string => {
    if(state.errors.amount === FormError.LowerLimitExceeded) {
      return `Minimum ${state.minimum}`;
    } else if (state.errors.amount === FormError.UpperLimitExceeded) {
      return "Not Enough Points";
    }
  }

  const getSubmitButtonText = (): string => {
    if(props.myPrediction) {
      return "Add To Prediction";
    }

    return "Create Prediction";
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
            <SimulatedPredictionOutcome 
              amount={state.amount ? parseInt(state.amount) : 0} 
              currentAmount={myPrediction ? myPrediction.amount : 0}
              matchup={_cloneDeep(matchup)} 
              playerID={state.playerID}
            />   
            <MatchupSpreadStatus 
              dayStatus={GameStatus.Upcoming} 
              game={game} 
              matchup={matchup} 
            />         
            {getMyPrediction()}
            <InputWrapper 
              label={`${player.points.available.toLocaleString()} points available`}
              error={state.errors.amount} 
              errorMessage={getAmountErrorMessage()}
            >
              <input 
                type="text"
                className="passion-one-font"
                disabled={state.status === FormStatus.Submitting || predictionsClosed}
                placeholder={`Enter amount (${state.minimum} minimum)`}
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
              {getSubmitButtonText()}
            </Button>
          </FormActions>
        </Form>          
      </ModalBody>
    </Modal>
  );
}