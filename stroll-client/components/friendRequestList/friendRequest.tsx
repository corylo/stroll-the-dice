import React, { useContext, useState } from "react";

import { IconButton } from "../buttons/iconButton";
import { UserLink } from "../userLink/userLink";

import { AppContext } from "../app/contexts/appContext";

import { FriendRequestService } from "../../services/friendRequestService";

import { FirestoreDateUtility } from "../../../stroll-utilities/firestoreDateUtility";

import { IFriend } from "../../../stroll-models/friend";
import { IFriendRequest } from "../../../stroll-models/friendRequest";

import { FriendRequestType } from "../../../stroll-enums/friendRequestType";
import { RequestStatus } from "../../../stroll-enums/requestStatus";
import { TooltipSide } from "../tooltip/tooltip";

interface FriendRequestProps {  
  request: IFriendRequest;
  type: FriendRequestType;
  handleOnAccept: (friend: IFriend) => void;
  handleOnRemove: () => void;
}

export const FriendRequest: React.FC<FriendRequestProps> = (props: FriendRequestProps) => {  
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const [status, setStatus] = useState<RequestStatus>(RequestStatus.Idle);

  const remove = async (): Promise<void> => {
    try {
      setStatus(RequestStatus.Loading);

      await FriendRequestService.delete(user.profile.uid, props.request.uid);

      props.handleOnRemove();
    } catch (err) {
      console.error(err);

      setStatus(RequestStatus.Error);
    }
  }

  const getActions = (): JSX.Element => {
    if(status === RequestStatus.Loading) {    
      return (      
        <div className="loading-spinner">
          <i className="fal fa-spinner-third" />
        </div>
      );
    } else if(props.type === FriendRequestType.Outgoing) {
      return (
        <IconButton 
          icon="fal fa-times"
          tooltip="Cancel"
          tooltipSide={TooltipSide.Left}
          handleOnClick={remove} 
        />
      )
    } else if(props.type === FriendRequestType.Incoming) {
      const accept = async (): Promise<void> => {
        try {
          setStatus(RequestStatus.Loading);
    
          await FriendRequestService.accept(user.profile.uid, props.request.uid);

          props.handleOnAccept({
            createdAt: FirestoreDateUtility.dateToTimestamp(new Date()),
            profile: props.request.profile,
            uid: props.request.uid
          });
        } catch (err) {
          console.error(err);

          setStatus(RequestStatus.Error);
        }
      }
  
      return (
        <React.Fragment>          
          <IconButton 
            icon="fal fa-times"               
            tooltip="Decline"
            tooltipSide={TooltipSide.Left}
            handleOnClick={remove} 
          />
          <IconButton 
            icon="fal fa-check"               
            tooltip="Accept"
            tooltipSide={TooltipSide.Left}
            handleOnClick={accept} 
          />
        </React.Fragment>
      )
    }
  }

  return (
    <div className="friend-request">
      <UserLink profile={props.request.profile} />
      <div className="friend-request-actions">
        {getActions()}
      </div>
    </div>
  );
}