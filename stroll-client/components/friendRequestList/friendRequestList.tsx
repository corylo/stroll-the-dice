import React from "react";
import classNames from "classnames";

import { Button } from "../buttons/button";
import { FriendRequest } from "./friendRequest";
import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { IFriend } from "../../../stroll-models/friend";
import { IFriendRequest } from "../../../stroll-models/friendRequest";

import { FriendRequestType } from "../../../stroll-enums/friendRequestType";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface FriendRequestListProps {  
  requests: IFriendRequest[];
  showViewMore: boolean;
  status: RequestStatus;
  type: FriendRequestType;
  handleOnAccept?: (friend: IFriend) => void;
  handleOnRemove: (type: FriendRequestType, uid: string) => void;
  viewMore: () => void;
}

export const FriendRequestList: React.FC<FriendRequestListProps> = (props: FriendRequestListProps) => { 
  if(props.requests.length > 0) {
    const getViewMoreButton = (): JSX.Element => {
      if(props.showViewMore) {
        return (        
          <Button 
            className="view-more-button passion-one-font" 
            handleOnClick={props.viewMore}
          >
            View more
          </Button>
        )
      }
    }
    
    const getLoadingIcon = (): JSX.Element => {
      if(props.status === RequestStatus.Loading) {
        return (
          <div className="loading-more-requests-wrapper">
            <LoadingIcon />
          </div>
        )
      } 
    }

    const getRequests = (): JSX.Element => {
      const requests: JSX.Element[] = props.requests.map((request: IFriendRequest) => (
        <FriendRequest 
          key={request.uid} 
          request={request}
          type={props.type} 
          handleOnAccept={props.handleOnAccept}
          handleOnRemove={() => props.handleOnRemove(props.type, request.uid)}
        />
      ));

      return (
        <div className="friend-request-list">
          {requests}
          {getViewMoreButton()}
          {getLoadingIcon()}
        </div>
      )
    }

    return (
      <div className={classNames("friend-request-list-wrapper", props.type.toLowerCase())}>
        <div className="friend-request-list-title">
          <h1 className="friend-request-list-title-text passion-one-font">{props.type} Requests</h1>     
        </div>
        <div className="friend-request-list-content">
          {getRequests()}
        </div>
      </div>
    );
  }

  return null;
}