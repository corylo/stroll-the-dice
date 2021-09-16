import firebase from "firebase/app";

import { IFriend } from "../../../../stroll-models/friend";

import { RequestStatus } from "../../../../stroll-enums/requestStatus";
import { IFriendRequest } from "../../../../stroll-models/friendRequest";

export interface IFriendsPageStateSectionStatuses {
  initial: RequestStatus;
  more: RequestStatus;
}

export const defaultFriendsPageSectionStatuses = (): IFriendsPageStateSectionStatuses => ({
  initial: RequestStatus.Loading,
  more: RequestStatus.Idle
});

export interface IFriendsPageStateSection {
  end: boolean;
  items: IFriend[] | IFriendRequest[];
  index: number;
  limit: number;  
  offset: firebase.firestore.QueryDocumentSnapshot;
  statuses: IFriendsPageStateSectionStatuses;
}

export const defaultFriendsPageStateSection = (limit?: number): IFriendsPageStateSection => ({  
  end: false,
  items: [],
  index: 0,
  limit: limit || 10,
  offset: null,
  statuses: defaultFriendsPageSectionStatuses()
});

export interface IFriendsPageState {
  friends: IFriendsPageStateSection;
  incoming: IFriendsPageStateSection;
  initialLoadStatus: RequestStatus;
  outgoing: IFriendsPageStateSection;
}

export const defaultFriendsPageState = (): IFriendsPageState => ({  
  friends: defaultFriendsPageStateSection(),
  incoming: defaultFriendsPageStateSection(5),
  initialLoadStatus: RequestStatus.Loading,
  outgoing: defaultFriendsPageStateSection(5)
});