import firebase from "firebase/app";

import { db } from "../firebase";

import { IGame } from "../../stroll-models/game";
import { IInvite, inviteConverter } from "../../stroll-models/invite";
import { FirebaseErrorCode } from "../../stroll-enums/firebaseErrorCode";
import { ErrorUtility } from "../utilities/errorUtility";
import { DocumentType } from "../../stroll-enums/documentType";

interface IInviteService {
  create: (invite: IInvite) => Promise<void>;
  get: (game: IGame) => Promise<IInvite>;
}

export const InviteService: IInviteService = {
  create: async (invite: IInvite): Promise<void> => {
    await db.collection("invites")      
      .withConverter(inviteConverter)
      .add(invite);

    return;
  },
  get: async (game: IGame): Promise<IInvite> => {
    try {
      const doc: firebase.firestore.DocumentSnapshot<IInvite> = await db.collection("games")
        .doc(game.id)
        .collection("invites")
        .doc(game.id)
        .withConverter(inviteConverter)
        .get();

      if(doc.exists) {
        return doc.data();
      }

      throw new Error(ErrorUtility.doesNotExist(DocumentType.Invite));
    } catch (err) {
      if(err.message === FirebaseErrorCode.MissingPermissions) {
        return null;
      }

      throw err;
    }
  }
}