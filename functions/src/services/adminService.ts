import firebase from "firebase-admin";

import { db } from "../../config/firebase";

import { Role } from "../../../stroll-enums/role";

interface IAdminService {
  checkIfAdmin: (uid: string) => Promise<boolean>;
}

export const AdminService: IAdminService = {
  checkIfAdmin: async (uid: string): Promise<boolean> => {
    const doc: firebase.firestore.DocumentSnapshot = await db.collection("profiles")
      .doc(uid)
      .collection("roles")
      .doc(Role.Admin)
      .get();

    if(doc.exists) {
      return true;
    }

    throw new Error(`User ${uid} does not have the necessary role: [${Role.Admin}]`);
  }
}