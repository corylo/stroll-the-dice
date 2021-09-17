import React, { createContext, useContext, useState } from "react";

import { FriendRequestList } from "../../components/friendRequestList/friendRequestList";
import { FriendRequestSender } from "../../components/friendRequestSender/friendRequestSender";
import { FriendsList } from "../../components/friendsList/friendsList";
import { Page } from "../../components/page/page";
import { SignInToDoThisMessage } from "../../components/signInToDoThisMessage/signInToDoThisMessage";

import { AppContext } from "../../components/app/contexts/appContext";

import { useFetchFriendRequestsEffect, useFetchFriendsEffect, useFetchInitialFriendsPageDataEffect } from "./effects/friendsPageEffects";

import { ImageUtility } from "../../utilities/imageUtility";

import { IFriend } from "../../../stroll-models/friend";
import { IFriendRequest } from "../../../stroll-models/friendRequest";
import { defaultFriendsPageState, IFriendsPageState } from "./models/friendsPageState";

import { AppStatus } from "../../enums/appStatus";
import { FriendRequestType } from "../../../stroll-enums/friendRequestType";
import { RequestStatus } from "../../../stroll-enums/requestStatus";

interface IFriendsPageContext {
  state: IFriendsPageState;
  setState: (state: IFriendsPageState) => void;
}

export const FriendsPageContext = createContext<IFriendsPageContext>(null);

interface FriendsPageProps {
  
}

export const FriendsPage: React.FC<FriendsPageProps> = (props: FriendsPageProps) => {
  const { appState } = useContext(AppContext);

  const { profile } = appState.user;

  const [state, setState] = useState<IFriendsPageState>(defaultFriendsPageState());

  useFetchInitialFriendsPageDataEffect(appState.status, profile.uid, state, setState);

  useFetchFriendRequestsEffect(profile.uid, state, FriendRequestType.Incoming, setState);

  useFetchFriendRequestsEffect(profile.uid, state, FriendRequestType.Outgoing, setState);

  useFetchFriendsEffect(profile.uid, state, setState);

  const handleAddRequest = (request: IFriendRequest): void => {
    setState({ 
      ...state, 
      outgoing: {
        ...state.outgoing,
        items: [request, ...state.outgoing.items] as IFriendRequest[]
      }
    }); 
  }

  const handleRemoveRequest = (friendRequestType: FriendRequestType, uid: string): void => {
    const type: "incoming" | "outgoing" = friendRequestType.toLowerCase() as "incoming" | "outgoing";

    setState({ 
      ...state, 
      [type]: { 
        ...state[type], 
        items: [...state[type].items].filter((item: IFriendRequest) => item.uid !== uid)
      }
    }); 
  }

  const handleAcceptRequest = (friend: IFriend): void => {
    setState({ 
      ...state, 
      friends: {
        ...state.friends,
        items: [friend, ...state.friends.items] as IFriend[]
      },
      incoming: {
        ...state.incoming,
        items: [...state.incoming.items].filter((item: IFriendRequest) => item.uid !== friend.uid)
      }
    }); 
  }

  const handleRemoveFriend = (uid: string): void => {
    setState({
      ...state,
      friends: {
        ...state.friends,
        items: [...state.friends.items].filter((item: IFriend) => item.uid !== uid) as IFriend[]
      }
    })
  }

  const getContent = (): JSX.Element => {
    if(appState.status === AppStatus.SignedIn) {
      const showViewMore = (type: "incoming" | "outgoing" | "friends"): boolean => {
        return (
          state[type].statuses.more !== RequestStatus.Loading &&
          state[type].items.length !== 0 &&
          !state[type].end
        )
      }

      const handleViewMore = (type: "incoming" | "outgoing" | "friends"): void => {
        setState({
          ...state,
          [type]: { ...state[type], index: state[type].index + 1 }
        })
      }

      return (
        <div className="friends-page-content">
          <FriendRequestSender handleOnAdd={handleAddRequest} />
          <FriendRequestList 
            requests={state.incoming.items as IFriendRequest[]} 
            showViewMore={showViewMore("incoming")}
            status={state.incoming.statuses.more}
            type={FriendRequestType.Incoming}
            handleOnAccept={handleAcceptRequest}
            handleOnRemove={handleRemoveRequest}
            viewMore={() => handleViewMore("incoming")}
          />
          <FriendRequestList 
            requests={state.outgoing.items as IFriendRequest[]} 
            type={FriendRequestType.Outgoing}
            showViewMore={showViewMore("outgoing")}
            status={state.outgoing.statuses.more}
            handleOnRemove={handleRemoveRequest}
            viewMore={() => handleViewMore("outgoing")}
          />
          <FriendsList 
            friends={state.friends.items as IFriend[]} 
            showViewMore={showViewMore("friends")}
            status={state.friends.statuses.more}
            handleOnRemove={handleRemoveFriend}
            viewMore={() => handleViewMore("friends")}
          />
        </div>
      )
    } else {
      return (
        <SignInToDoThisMessage
          image={ImageUtility.getGraphic("park", "png")}
          text="Sign in to view your friends!"
        />
      )
    }
  }

  return(
    <FriendsPageContext.Provider value={{ state, setState }}>
      <Page id="friends-page" backgroundGraphic="" status={state.initialLoadStatus}>
        {getContent()}
      </Page>
    </FriendsPageContext.Provider>
  )
}