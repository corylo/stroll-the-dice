import React from "react";

import { Button } from "../buttons/button";
import { EmptyMessage } from "../emptyMessage/emptyMessage";
import { LoadingIcon } from "../loadingIcon/loadingIcon";

import { IFriend } from "../../../stroll-models/friend";

import { RequestStatus } from "../../../stroll-enums/requestStatus";
import { Friend } from "./friend";

interface FriendsListProps {  
  friends: IFriend[];
  showViewMore: boolean;
  status: RequestStatus;
  handleOnRemove: (uid: string) => void;
  viewMore: () => void;
}

export const FriendsList: React.FC<FriendsListProps> = (props: FriendsListProps) => {  
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
        <div className="loading-more-friends-wrapper">
          <LoadingIcon />
        </div>
      )
    } 
  }

  const getFriends = (): JSX.Element => {
    if(props.friends.length > 0) {
      const friends: JSX.Element[] = props.friends.map((friend: IFriend) => (
        <Friend key={friend.uid} friend={friend} handleOnRemove={() => props.handleOnRemove(friend.uid)} />
      ));

      return (
        <div className="friends-list">
          {friends}
          {getViewMoreButton()}
          {getLoadingIcon()}
        </div>
      )
    }

    return (
      <EmptyMessage text="When you add friends they will show up here!" />
    )
  }

  return (
    <div className="friends-list-wrapper">
      <div className="friends-list-title">
        <h1 className="friends-list-title-text passion-one-font">Friends</h1>     
      </div>
      <div className="friends-list-content">
        {getFriends()}
      </div>
    </div>
  );
}