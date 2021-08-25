import firebase from "firebase/app";

export interface IFriendIDReference {
  id: string;
  uid: string;
}

export const friendIDReferenceConverter: any = {
  toFirestore(ref: IFriendIDReference): firebase.firestore.DocumentData {
    return {
      uid: ref.uid
    }
  },
  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot<IFriendIDReference>,
    options: firebase.firestore.SnapshotOptions
  ): IFriendIDReference {
    const data: IFriendIDReference = snapshot.data(options);

    return {
      id: snapshot.id,
      uid: data.uid
    }
  }
}