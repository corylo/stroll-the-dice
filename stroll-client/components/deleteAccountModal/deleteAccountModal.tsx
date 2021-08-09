import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { auth } from "../../config/firebase";

import { Button } from "../buttons/button";
import { Modal } from "../modal/modal";
import { ModalActions } from "../modal/modalActions";
import { ModalBody } from "../modal/modalBody";
import { ModalStatusMessage } from "../modal/modalStatusMessage";
import { ModalTitle } from "../modal/modalTitle";

import { AppContext } from "../app/contexts/appContext";

import { AppAction } from "../../enums/appAction";
import { FirebaseErrorCode } from "../../../stroll-enums/firebaseErrorCode";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface DeleteAccountModalProps {  
  
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = (props: DeleteAccountModalProps) => {  
  const { appState, dispatchToApp } = useContext(AppContext);

  const { statuses, toggles } = appState;

  const dispatch = (type: AppAction, payload?: any): void => dispatchToApp({ type, payload });

  const history: any = useHistory();

  if(toggles.deleteAccount) {
    const handleOnDelete = async () => {
      try {
        dispatch(AppAction.InitiateAccountDeletion);

        await auth.currentUser.delete();

        dispatch(AppAction.CompleteAccountDeletion);
        
        setTimeout(() => history.replace("/goodbye"), 10);
      } catch (err) {
        console.error(err);

        if(err.code === FirebaseErrorCode.RequiresRecentLogin) {
          dispatch(AppAction.FailedAccountDeletion, FirebaseErrorCode.RequiresRecentLogin);
        } else {
          dispatch(AppAction.FailedAccountDeletion, "");
        }
      }
    }

    const handleSignOut = async () => {
      try {
        dispatch(AppAction.InitiateSignOut);
        
        await auth.signOut();
        
        location.reload();
      } catch (err) {
        console.error(err);
      }
    }

    const getContent = (): JSX.Element => {
      if(statuses.deleteAccount.message === FirebaseErrorCode.RequiresRecentLogin) {
        return (
          <React.Fragment>
            <ModalBody>   
              <p className="passion-one-font">This action requires a recent sign in. Please sign out and sign in again.</p> 
            </ModalBody>
            <ModalActions>          
              <Button
                className="delete-account-button fancy-button"
                handleOnClick={handleSignOut} 
              >
                <h1 className="passion-one-font">Sign Out</h1>
              </Button>
            </ModalActions>
          </React.Fragment>
        )
      }

      const getErrorMessage = (): JSX.Element => {
        if(statuses.deleteAccount.is === RequestStatus.Error) {
          return (
            <ModalStatusMessage 
              status={RequestStatus.Error} 
              statusMessage="There was an issue deleting your account. Please refresh and try again!" 
            />
          )
        }
      }

      return (
        <React.Fragment>
          <ModalBody>   
            <p className="passion-one-font">I understand that deleting my account is permanent.</p> 
            <p className="passion-one-font">I understand that continuing with this action will remove all of my personally identifiable profile, game, and player data forever as well as delete any Game Days I have purchased.</p>          
          </ModalBody>
          <ModalActions>          
            <Button
              className="delete-account-button fancy-button red"
              handleOnClick={handleOnDelete} 
            >
              <i className="far fa-trash-alt" />
              <h1 className="passion-one-font">Delete Forever</h1>
            </Button>
            <Button
              className="delete-account-button fancy-button"
              handleOnClick={() => dispatch(AppAction.ToggleDeleteAccount, false)} 
            >
              <h1 className="passion-one-font">Nevermind</h1>
            </Button>
          </ModalActions>
          {getErrorMessage()}
        </React.Fragment>
      )
    }

    return (
      <Modal id="delete-account-modal" status={statuses.deleteAccount.is} priority>
        <ModalTitle text="Delete My Account" handleOnClose={() => dispatch(AppAction.ToggleDeleteAccount, false)} />
        {getContent()}
      </Modal>
    );
  }

  return null;
}