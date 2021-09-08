import React, { useContext } from "react";

import { Button } from "../../../../components/buttons/button";
import { Modal } from "../../../../components/modal/modal";
import { ModalBody } from "../../../../components/modal/modalBody";
import { ModalTitle } from "../../../../components/modal/modalTitle";
import { StepTrackerConnectionStep } from "../stepTrackerConnectionStep/stepTrackerConnectionStep";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { useConnectStepTrackerEffect } from "../../effects/profilePageEffects";

import { StepTrackerService } from "../../../../services/stepTrackerService";

import { AppAction } from "../../../../enums/appAction";
import { RequestStatus } from "../../../../../stroll-enums/requestStatus";
import { StepTracker } from "../../../../../stroll-enums/stepTracker";
import { StepTrackerConnectionStatus } from "../../../../../stroll-enums/stepTrackerConnectionStatus";

interface StepTrackerConnectionModalProps {   
  toggled: boolean;
  back: () => void;
}

export const StepTrackerConnectionModal: React.FC<StepTrackerConnectionModalProps> = (props: StepTrackerConnectionModalProps) => {    
  const { appState, dispatchToApp } = useContext(AppContext);

  const { tracker } = appState.user.profile;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  useConnectStepTrackerEffect(appState, dispatch);

  if(props.toggled) {
    const getTitle = (): string => {
      if(tracker.status === StepTrackerConnectionStatus.Verified) {
        return `Connected ${tracker.name}`;
      } else if(tracker.status === StepTrackerConnectionStatus.Disconnecting) {
        return `Disconnecting ${tracker.name}...`;
      } else if (tracker.status === StepTrackerConnectionStatus.Disconnected) {
        return `Disconnected ${tracker.name}`;
      } else if (tracker.status === StepTrackerConnectionStatus.DisconnectionFailed) {
        return `Could not disconnect ${tracker.name}`;
      } else if (tracker.status === StepTrackerConnectionStatus.ConnectionFailed) {
        return `Could not connect ${tracker.name}`;
      }

      return `Connecting ${tracker.name}...`;
    }

    const getSteps = (): JSX.Element => {
      if(
        tracker.status === StepTrackerConnectionStatus.Disconnecting ||
        tracker.status === StepTrackerConnectionStatus.DisconnectionFailed
      ) {
        const label: string = tracker.status === StepTrackerConnectionStatus.Disconnecting 
          ? "Disconnecting..." 
          : "Disconnection Failed";

        const status: RequestStatus = tracker.status === StepTrackerConnectionStatus.Disconnecting 
          ? RequestStatus.Loading 
          : RequestStatus.Error;

        return (
          <StepTrackerConnectionStep
            index={1}
            label={label}
            status={status}
            tracker={tracker.name}
          />
        )
      } else if(tracker.status === StepTrackerConnectionStatus.Disconnected) {
        return (
          <StepTrackerConnectionStep
            index={1}
            label="Disconnected"
            status={RequestStatus.Success}
            tracker={tracker.name}
          />
        )
      } else if(
        tracker.status !== StepTrackerConnectionStatus.Idle && 
        tracker.name !== StepTracker.Unknown
      ) {    
        const getConnectingStatus = (): RequestStatus => {
          if(
            tracker.status === StepTrackerConnectionStatus.Initiated ||
            tracker.status === StepTrackerConnectionStatus.Connecting
          ) {
            return RequestStatus.Loading;
          } else if(tracker.status === StepTrackerConnectionStatus.ConnectionFailed) {
            return RequestStatus.Error;
          }
    
          return RequestStatus.Success;
        }
      
        const getConnectingLabel = (): string => {
          if(
            tracker.status === StepTrackerConnectionStatus.Initiated ||
            tracker.status === StepTrackerConnectionStatus.Connecting
          ) {
            return "Connecting...";
          } else if (tracker.status === StepTrackerConnectionStatus.ConnectionFailed) {
            return "Connection Failed";
          }
    
          return "Connected";
        }
        
        const getVerifyingStatus = (): RequestStatus => {
          if(
            tracker.status === StepTrackerConnectionStatus.Initiated ||
            tracker.status === StepTrackerConnectionStatus.Connecting ||
            tracker.status === StepTrackerConnectionStatus.ConnectionFailed
          ) {
            return RequestStatus.Idle;
          } else if(tracker.status === StepTrackerConnectionStatus.Verifying) {
            return RequestStatus.Loading;
          } else if(tracker.status === StepTrackerConnectionStatus.VerificationFailed) {
            return RequestStatus.Error;
          }
    
          return RequestStatus.Success;
        }
    
        const getVerifyingLabel = (): string => {
          if(
            tracker.status === StepTrackerConnectionStatus.Connected ||
            tracker.status === StepTrackerConnectionStatus.Connecting ||
            tracker.status === StepTrackerConnectionStatus.ConnectionFailed
          ) {
            return "Verifying";
          } else if(tracker.status === StepTrackerConnectionStatus.Verifying) {
            return "Verifying...";
          } else if (tracker.status === StepTrackerConnectionStatus.VerificationFailed) {
            return "Verification Failed";
          }
    
          return "Verified";
        }
    
        const getConnectionErrorInfo = (): JSX.Element => {
          if(tracker.status === StepTrackerConnectionStatus.ConnectionFailed) {
            return (
              <div className="step-tracker-connection-step-error-info">
                <div className="step-tracker-connection-step-error-info-clauses">
                  <h1 className="passion-one-font">Looks like there was an issue gaining access to your {tracker.name} step data. Please close this modal and try selecting your step tracker again.</h1>
                </div>
              </div>
            )
          }
        }

        const handleRetryVerification = (): void => dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Connected);

        const handleDisconnect = async (): Promise<void> => {
          try {
            dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Disconnecting);
  
            await StepTrackerService.disconnect();
  
            dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.Disconnected);
          } catch (err) {
            console.error(err);
            
            dispatch(AppAction.SetStepTrackerConnectionStatus, StepTrackerConnectionStatus.DisconnectionFailed);
          }
        }
  
        const getVerificationErrorInfo = (): JSX.Element => {
          if(tracker.status === StepTrackerConnectionStatus.VerificationFailed) {
            const getAppDownloadClause = (): JSX.Element => {
              if(tracker.name === StepTracker.GoogleFit) {
                return (
                  <h1 className="passion-one-font">Please make sure you have downloaded the {StepTracker.GoogleFit} app onto your phone and synced your data on the Journal page at least once. You may have to plug your phone in.</h1>
                );
              } else if (tracker.name === StepTracker.Fitbit) {
                return (
                  <React.Fragment>
                    <h1 className="passion-one-font">Please make sure you have downloaded the {StepTracker.Fitbit} app onto your phone and connected a step tracking device.</h1>
                    <h1 className="passion-one-font">If you don't have a Fitbit compatible step tracking device you'll have to enable Mobile Track under device setup.</h1>
                  </React.Fragment>
                );
              }
            }

            return (
              <div className="step-tracker-connection-step-error-info">
                <div className="step-tracker-connection-step-error-actions">
                  <Button className="fancy-button" handleOnClick={handleRetryVerification}>
                    <h1 className="passion-one-font">Retry Verification</h1>
                  </Button>
                  <Button className="disconnect-button fancy-button" handleOnClick={handleDisconnect}>
                    <h1 className="passion-one-font">Disconnect</h1>
                  </Button>
                </div>
                <div className="step-tracker-connection-step-error-info-clauses">
                  <h1 className="passion-one-font">Looks like we were unable to verify your {tracker.name} step data.</h1> 
                  {getAppDownloadClause()}
                  <h1 className="passion-one-font">Once you've completed these steps you may return here and retry verifying.</h1>
                </div>
              </div>
            )
          }
        }

        const getVerifiedButtons = (): JSX.Element => {
          if(tracker.status === StepTrackerConnectionStatus.Verified) {
            return (     
              <React.Fragment>    
                <Button className="disconnect-button fancy-button" handleOnClick={props.back}>
                  <h1 className="passion-one-font">Done</h1>
                </Button>    
                <Button className="disconnect-button fancy-button red" handleOnClick={handleDisconnect}>
                  <h1 className="passion-one-font">Disconnect {tracker.name}</h1>
                </Button>
              </React.Fragment>
            )
          }
        }

        return (
          <React.Fragment>
            <StepTrackerConnectionStep
              index={1}
              label={getConnectingLabel()}
              status={getConnectingStatus()}
              tracker={tracker.name}
            />
            {getConnectionErrorInfo()}
            <StepTrackerConnectionStep
              index={2}
              label={getVerifyingLabel()}
              status={getVerifyingStatus()}
              tracker={tracker.name}
            />
            {getVerificationErrorInfo()}
            {getVerifiedButtons()}
          </React.Fragment>
        )
      }
    }

    const getHandleOnClose = (): any => {
      if(
        tracker.status !== StepTrackerConnectionStatus.Connecting &&
        tracker.status !== StepTrackerConnectionStatus.Verifying &&
        tracker.status !== StepTrackerConnectionStatus.Disconnecting
      ) {
        return props.back;
      }
    }

    return (
      <Modal id="step-tracker-connection-modal">
        <ModalTitle text={getTitle()} handleOnClose={getHandleOnClose()} />
        <ModalBody>       
          {getSteps()}
        </ModalBody>
      </Modal>
    );
  }

  return null;
}