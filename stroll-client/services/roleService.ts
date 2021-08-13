import firebase from "firebase/app";

import { db } from "../config/firebase";

import { Role } from "../../stroll-enums/role";

interface IRoleService {
  getByUID: (uid: string) => Promise<Role[]>;
}

export const RoleService: IRoleService = {
  getByUID: async (uid: string): Promise<Role[]> => {
    try {
      const snap: firebase.firestore.QuerySnapshot = await db.collection("profiles")
        .doc(uid)
        .collection("roles")
        .get();

      let updates: Role[] = [];
        
      if(!snap.empty) {
        snap.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => updates.push(doc.id as Role));

        return updates;
      }
    } catch (err) {}

    return [];
  }
}