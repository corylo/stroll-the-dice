import { useEffect } from "react";

import firebase from "firebase/app";

import { FriendRequestService } from "../../../services/friendRequestService";
import { FriendService } from "../../../services/friendService";

import { IFriend } from "../../../../stroll-models/friend";
import { IFriendsPageState, IFriendsPageStateSection } from "../models/friendsPageState";
import { IFriendRequest } from "../../../../stroll-models/friendRequest";
import { IGetFriendRequestsResponse } from "../../../../stroll-models/getFriendRequestsResponse";
import { IGetFriendsResponse } from "../../../../stroll-models/getFriendsResponse";

import { AppStatus } from "../../../enums/appStatus";
import { FriendRequestType } from "../../../../stroll-enums/friendRequestType";
import { RequestStatus } from "../../../../stroll-enums/requestStatus";

export const useFetchInitialFriendsPageDataEffect = (
  appStatus: AppStatus,
  uid: string, 
  state: IFriendsPageState, 
  setState: (state: IFriendsPageState) => void
): void => {
  useEffect(() => {
    if(appStatus === AppStatus.SignedIn && uid !== "") {
      const mapUpdatedSection = (
        section: "friends" | "incoming" | "outgoing",
        end: boolean, 
        items: IFriend[] | IFriendRequest[], 
        offset: firebase.firestore.QueryDocumentSnapshot
      ): IFriendsPageStateSection => {
        return {
          ...state[section],
          end,
          items,
          offset,
          statuses: {
            ...state[section].statuses,
            initial: RequestStatus.Success
          }
        }
      }

      const fetch = async (): Promise<void> => {
        try {
          setState({ ...state, initialLoadStatus: RequestStatus.Loading });

          const friendsResponse: IGetFriendsResponse = await FriendService.getAll(uid, state.friends.limit, state.friends.offset),
            incomingResponse: IGetFriendRequestsResponse = await FriendRequestService.getAll(uid, FriendRequestType.Incoming, state.incoming.limit, state.incoming.offset),
            outgoingResponse: IGetFriendRequestsResponse = await FriendRequestService.getAll(uid, FriendRequestType.Outgoing, state.outgoing.limit, state.outgoing.offset);
            
          const friends: IFriendsPageStateSection = mapUpdatedSection(
            "friends",
            friendsResponse.friends.length < state.friends.limit,
            friendsResponse.friends,
            friendsResponse.offset
          );

          const incoming: IFriendsPageStateSection = mapUpdatedSection(
            "incoming",
            incomingResponse.requests.length < state.incoming.limit,
            incomingResponse.requests,
            incomingResponse.offset
          );

          const outgoing: IFriendsPageStateSection = mapUpdatedSection(
            "outgoing",
            outgoingResponse.requests.length < state.outgoing.limit,
            outgoingResponse.requests,
            outgoingResponse.offset
          );

          setState({
            ...state,
            friends,
            incoming,
            outgoing,
            initialLoadStatus: RequestStatus.Success
          });
        } catch (err) {
          console.error(err);

          setState({ ...state, initialLoadStatus: RequestStatus.Error });
        }
      }

      fetch();
    } else if (appStatus === AppStatus.SignedOut) {
      setState({ ...state, initialLoadStatus: RequestStatus.Idle });
    }
  }, [appStatus, uid]);
}

export const useFetchFriendRequestsEffect = (
  uid: string, 
  state: IFriendsPageState, 
  friendRequestType: FriendRequestType,
  setState: (state: IFriendsPageState) => void
): void => {
  const type: "incoming" | "outgoing" = friendRequestType.toLowerCase() as "incoming" | "outgoing";

  useEffect(() => {
    const updateStatus = (more: RequestStatus): void => {
      setState({ 
        ...state, 
        [type]: { 
          ...state[type], 
          statuses: { ...state[type].statuses, more }
        }
      });
    }

    const fetch = async (): Promise<void> => {
      if(state[type].index > 0) {
        try {
          updateStatus(RequestStatus.Loading);

          const res: IGetFriendRequestsResponse = await FriendRequestService.getAll(uid, friendRequestType, state[type].limit, state[type].offset);

          setState({ 
            ...state, 
            [type]: { 
              ...state[type], 
              end: res.requests.length < state[type].limit,
              items: [...state[type].items, ...res.requests] as IFriendRequest[],
              offset: res.offset,
              statuses: { ...state[type].statuses, more: RequestStatus.Success }
            }
          });
        } catch (err) {
          console.error(err);

          updateStatus(RequestStatus.Error);
        }
      }
    }

    fetch();
  }, [uid, state[type].index]);
}

export const useFetchFriendsEffect = (
  uid: string, 
  state: IFriendsPageState, 
  setState: (state: IFriendsPageState) => void
): void => {
  useEffect(() => {
    const updateStatus = (more: RequestStatus): void => {
      setState({
        ...state,
        friends: {
          ...state.friends,
          statuses: { ...state.friends.statuses, more }
        }
      });
    }

    const fetch = async (): Promise<void> => {
      if(state.friends.index > 0) {
        try {
          updateStatus(RequestStatus.Loading);

          const res: IGetFriendsResponse = await FriendService.getAll(uid, state.friends.limit, state.friends.offset);

          setState({ 
            ...state, 
            friends: { 
              ...state.friends, 
              end: res.friends.length < state.friends.limit,
              items: [...state.friends.items, ...res.friends] as IFriend[],
              offset: res.offset,
              statuses: { ...state.friends.statuses, more: RequestStatus.Success }
            }
          });
        } catch (err) {
          console.error(err);
          
          updateStatus(RequestStatus.Error);
        }
      }
    }

    fetch();
  }, [uid, state.friends.index]);
}