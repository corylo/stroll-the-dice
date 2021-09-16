import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ProfileService } from "./profileService";

import { ProfileUtility } from "../../stroll-utilities/profileUtility";

import { friendConverter, IFriend } from "../../stroll-models/friend";
import { IGetFriendsResponse } from "../../stroll-models/getFriendsResponse";
import { IProfile } from "../../stroll-models/profile";
import { IProfileReference } from "../../stroll-models/profileReference";

interface IFriendService {
  delete: (myUID: string, theirUID: string) => Promise<void>;
  getAll: (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetFriendsResponse>; 
  getProfiles: (friends: IFriend[]) => Promise<IFriend[]>;  
}

export const FriendService: IFriendService = {  
  delete: async (myUID: string, theirUID: string): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const myRequestRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(myUID)
      .collection("friend_requests")
      .doc(theirUID);

    batch.delete(myRequestRef);

    const theirRequestRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(theirUID)
      .collection("friend_requests")
      .doc(myUID);

    batch.delete(theirRequestRef);

    const myFriendRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(myUID)
      .collection("friends")
      .doc(theirUID);

    batch.delete(myFriendRef);

    const theirFriendRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(theirUID)
      .collection("friends")
      .doc(myUID);

    batch.delete(theirFriendRef);

    return await batch.commit();    
  },
  getAll: async (uid: string, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetFriendsResponse> => {
    let query: firebase.firestore.Query = db
      .collection("profiles")
      .doc(uid)
      .collection("friends")      
      .orderBy("createdAt", "desc");

    if(offset !== null) {
      query = query.startAfter(offset);
    }
  
    const snap: firebase.firestore.QuerySnapshot = await query     
      .limit(limit)
      .withConverter(friendConverter)
      .get();

    let friends: IFriend[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IFriend>) => 
      friends.push(doc.data()));
      
    if(friends.length > 0) {
      friends = await FriendService.getProfiles(friends);
    }

    const newOffset: firebase.firestore.QueryDocumentSnapshot = snap.size > 0 
      ? snap.docs[snap.size - 1] 
      : null;

    return {
      friends,
      offset: newOffset
    }
  },
  getProfiles: async (friends: IFriend[]): Promise<IFriend[]> => {
    const uids: string[] = friends.map((friend: IFriend) => friend.uid);

    const profiles: IProfileReference[] = (await ProfileService.getAllByUID(uids))
      .map((profile: IProfile) => ProfileUtility.mapReference(profile));

    const find = (uid: string): IProfileReference => 
      profiles.find((profile: IProfileReference) => profile.uid === uid);

    return friends.map((friend: IFriend) => ({
      ...friend,
      profile: find(friend.uid)
    }));
  }
}