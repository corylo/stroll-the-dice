import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ProfileService } from "./profileService";

import { ProfileUtility } from "../../stroll-utilities/profileUtility";

import { friendConverter, IFriend } from "../../stroll-models/friend";
import { friendRequestConverter, IFriendRequest } from "../../stroll-models/friendRequest";
import { IGetFriendRequestsResponse } from "../../stroll-models/getFriendRequestsResponse";
import { IProfile } from "../../stroll-models/profile";
import { IProfileReference } from "../../stroll-models/profileReference";

import { FriendRequestType } from "../../stroll-enums/friendRequestType";

interface IFriendRequestService {    
  accept: (myUID: string, theirUID: string) => Promise<void>;
  create: (fromUID: string, toUID: string) => Promise<void>;
  delete: (fromUID: string, toUID: string) => Promise<void>;
  getAll: (uid: string, type: FriendRequestType, limit: number, offset: firebase.firestore.QueryDocumentSnapshot) => Promise<IGetFriendRequestsResponse>;  
  getProfiles: (requests: IFriendRequest[]) => Promise<IFriendRequest[]>;  
}

export const FriendRequestService: IFriendRequestService = {
  accept: async (myUID: string, theirUID: string): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const myRequestRef: firebase.firestore.DocumentReference<IFriendRequest> = db.collection("profiles")
      .doc(myUID)
      .collection("friend_requests")
      .doc(theirUID)
      .withConverter<IFriendRequest>(friendRequestConverter);

    batch.update(myRequestRef, {
      acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const theirRequestRef: firebase.firestore.DocumentReference<IFriendRequest> = db.collection("profiles")
      .doc(theirUID)
      .collection("friend_requests")
      .doc(myUID)
      .withConverter<IFriendRequest>(friendRequestConverter);

    batch.update(theirRequestRef, {      
      acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    const myFriendRef: firebase.firestore.DocumentReference<IFriend> = db.collection("profiles")
      .doc(myUID)
      .collection("friends")
      .doc(theirUID)
      .withConverter<IFriend>(friendConverter);

    batch.set(myFriendRef, {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: ""
    });

    const theirFriendRef: firebase.firestore.DocumentReference<IFriend> = db.collection("profiles")
      .doc(theirUID)
      .collection("friends")
      .doc(myUID)
      .withConverter<IFriend>(friendConverter);

    batch.set(theirFriendRef, {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: ""
    });

    return await batch.commit();    
  },
  create: async (fromUID: string, toUID: string): Promise<void> => {  
    const batch: firebase.firestore.WriteBatch = db.batch();

    const incomingRef: firebase.firestore.DocumentReference<IFriendRequest> = db.collection("profiles")
      .doc(toUID)
      .collection("friend_requests")
      .doc(fromUID)
      .withConverter<IFriendRequest>(friendRequestConverter);

    batch.set(incomingRef, {
      acceptedAt: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      type: FriendRequestType.Incoming,
      uid: ""
    });

    const outgoingRef: firebase.firestore.DocumentReference<IFriendRequest> = db.collection("profiles")
      .doc(fromUID)
      .collection("friend_requests")
      .doc(toUID)
      .withConverter<IFriendRequest>(friendRequestConverter);

    batch.set(outgoingRef, {
      acceptedAt: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      type: FriendRequestType.Outgoing,
      uid: ""
    });

    return await batch.commit();
  },
  delete: async (fromUID: string, toUID: string): Promise<void> => {
    const batch: firebase.firestore.WriteBatch = db.batch();

    const incomingRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(toUID)
      .collection("friend_requests")
      .doc(fromUID);

    batch.delete(incomingRef);

    const outgoingRef: firebase.firestore.DocumentReference = db.collection("profiles")
      .doc(fromUID)
      .collection("friend_requests")
      .doc(toUID);

    batch.delete(outgoingRef);
    
    return await batch.commit();
  },
  getAll: async (uid: string, type: FriendRequestType, limit: number, offset: firebase.firestore.QueryDocumentSnapshot): Promise<IGetFriendRequestsResponse> => {
    let query: firebase.firestore.Query = db
      .collection("profiles")
      .doc(uid)
      .collection("friend_requests")      
      .where("type", "==", type)
      .where("acceptedAt", "==", null)
      .orderBy("createdAt", "desc");

    if(offset !== null) {
      query = query.startAfter(offset);
    }
  
    const snap: firebase.firestore.QuerySnapshot = await query     
      .limit(limit)
      .withConverter(friendRequestConverter)
      .get();

    let results: IFriendRequest[] = [];

    snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IFriendRequest>) => 
      results.push(doc.data()));
      
    if(results.length > 0) {
      results = await FriendRequestService.getProfiles(results);
    }

    const newOffset: firebase.firestore.QueryDocumentSnapshot = snap.size > 0 
      ? snap.docs[snap.size - 1] 
      : null;

    return {
      requests: results,
      offset: newOffset
    }
  },
  getProfiles: async (requests: IFriendRequest[]): Promise<IFriendRequest[]> => {
    const uids: string[] = requests.map((request: IFriendRequest) => request.uid);

    const profiles: IProfileReference[] = (await ProfileService.getAllByUID(uids))
      .map((profile: IProfile) => ProfileUtility.mapReference(profile));

    const find = (uid: string): IProfileReference => 
      profiles.find((profile: IProfileReference) => profile.uid === uid);

    return requests.map((request: IFriendRequest) => ({
      ...request,
      profile: find(request.uid)
    }));
  }
}