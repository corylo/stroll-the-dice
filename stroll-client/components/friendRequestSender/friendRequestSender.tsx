import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { IconButton } from "../buttons/iconButton";
import { InputWrapper } from "../inputWrapper/inputWrapper";

import { AppContext } from "../app/contexts/appContext";

import { FriendRequestService } from "../../services/friendRequestService";

import { IFriendRequest } from "../../../stroll-models/friendRequest";

import { FormError } from "../../enums/formError";
import { RequestStatus } from "../../../stroll-enums/requestStatus";
import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";
import { FriendRequestType } from "../../../stroll-enums/friendRequestType";
import { FriendIDService } from "../../services/friendIDService";
import { IProfileReference } from "../../../stroll-models/profileReference";
import { ProfileService } from "../../services/profileService";

interface IFriendRequestSenderState {
  error: FormError;
  value: string;
  status: RequestStatus;
}

const defaultFriendRequestSenderState = (): IFriendRequestSenderState => ({
  error: FormError.None,
  value: "",
  status: RequestStatus.Idle
});

interface FriendRequestSenderProps {
  handleOnAdd: (request: IFriendRequest) => void;
}

export const FriendRequestSender: React.FC<FriendRequestSenderProps> = (props: FriendRequestSenderProps) => {  
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [state, setState] = useState<IFriendRequestSenderState>(defaultFriendRequestSenderState());

  const updateValue = (value: string): void => setState({ ...state, value });

  const validate = (): boolean => {
    if(state.value.trim().length === 6) {
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

  useEffect(() => {
    if(state.status === RequestStatus.Error) {
      setState({ ...state, status: RequestStatus.Idle });
    }

    if(state.status === RequestStatus.Success && state.value !== "") {
      setState({ ...state, status: RequestStatus.Idle });
    }
  }, [state.value]);

  const send = async (): Promise<void> => {
    if(validate() && state.status === RequestStatus.Idle) {
      try {
        setState({ ...state, status: RequestStatus.Loading });

        const toUID: string = await FriendIDService.getUIDByFriendID(state.value);

        await FriendRequestService.create(user.profile.uid, toUID);
          
        const profile: IProfileReference = await ProfileService.get.by.uid(toUID);

        props.handleOnAdd({
          acceptedAt: null,
          createdAt: FirestoreDateUtility.dateToTimestamp(new Date()),
          profile,
          type: FriendRequestType.Outgoing,
          uid: toUID
        });
        
        setState({ ...defaultFriendRequestSenderState(), status: RequestStatus.Success });
      } catch (err) {
        console.error(err);

        setState({ ...state, status: RequestStatus.Error });
      }
    }
  }

  const handleOnKeyDown = (e: any): void => {
    if(e.key === "Enter") {
      send();
    }
  }

  const getStatusMessage = (): JSX.Element => {
    if(state.status === RequestStatus.Success) {
      return (
        <h1 className="friend-request-status-message success passion-one-font">Friend request sent!</h1>
      )
    } else if(state.status === RequestStatus.Error) {
      return (
        <h1 className="friend-request-status-message error passion-one-font">Unable to send. Double check the friend code and make sure you haven't already sent this user a friend request.</h1>
      )
    }
  }

  return (
    <div className={classNames("friend-request-sender", { loading: state.status === RequestStatus.Loading })}>
      <div className="friend-code-input-wrapper">
        <InputWrapper
          label="Send Friend Request" 
          value={state.value}
          error={state.error}
          errorMessage="Invalid Code"
        >
          <input 
            type="text"
            className="passion-one-font"
            disabled={state.status === RequestStatus.Loading}
            placeholder="Enter friend code"
            value={state.value}
            onChange={(e: any) => updateValue(e.target.value)}
            onKeyDown={handleOnKeyDown}
          />
        </InputWrapper>
        <IconButton
          className="send-friend-request-button"
          icon={state.status === RequestStatus.Loading ? "fal fa-spinner-third" : "fal fa-arrow-right"}
          handleOnClick={send}
        />
      </div>
      {getStatusMessage()}
    </div>
  );
}