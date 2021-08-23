import firebase from "firebase/app";

import { db } from "../config/firebase";

import { ErrorUtility } from "../utilities/errorUtility";

import { IGame } from "../../stroll-models/game";
import { IInvite, inviteConverter } from "../../stroll-models/invite";

import { DocumentType } from "../../stroll-enums/documentType";
import { FirebaseErrorCode } from "../../stroll-enums/firebaseErrorCode";

interface IInviteServiceGetBy {
  game: (game: IGame) => Promise<IInvite>;
  id: (game: IGame, id: string) => Promise<IInvite>;  
}

interface IInviteServiceGet {
  by: IInviteServiceGetBy;
}

interface IInviteService {
  create: (invite: IInvite) => Promise<void>;
  get: IInviteServiceGet;
}

export const InviteService: IInviteService = {
  create: async (invite: IInvite): Promise<void> => {
    await db.collection("invites")      
      .withConverter(inviteConverter)
      .add(invite);
  },
  get: {
    by: {
      game: async (game: IGame): Promise<IInvite> => {
        try {
          const snap: firebase.firestore.QuerySnapshot = await db.collection("games")
            .doc(game.id)
            .collection("invites")
            .limit(1)
            .withConverter(inviteConverter)
            .get();

          let invites: IInvite[] = [];
          
          if(snap.docs.length === 1) {
            snap.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot<IInvite>) => 
              invites.push(doc.data()));

            return invites[0];
          }
      
          throw new Error(ErrorUtility.doesNotExist(DocumentType.Invite));
        } catch (err) {
          if(err.code === FirebaseErrorCode.PermissionDenied) {
            return null;
          }

          throw err;
        }
      },
      id: async (game: IGame, id: string): Promise<IInvite> => {
        const doc: firebase.firestore.DocumentSnapshot<IInvite> = await db.collection("games")
          .doc(game.id)
          .collection("invites")
          .doc(id)
          .withConverter(inviteConverter)
          .get();

        if(doc.exists) {
          return doc.data();
        }

        throw new Error(ErrorUtility.doesNotExist(DocumentType.Invite));
      }
    }
  }
}