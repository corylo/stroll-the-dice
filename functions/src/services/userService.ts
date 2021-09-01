import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";
import axios from "axios";

import { IUpdateUserEmailRequest } from "../../../stroll-models/updateUserEmailRequest";

interface IUserService {
  getByEmail: (email: string) => Promise<string>;
  getAllEmailsByUID: (uids: string[]) => Promise<string[]>;  
  getEmailByUID: (uid: string) => Promise<string>;
  updateEmail: (request: IUpdateUserEmailRequest, context: https.CallableContext) => Promise<void>;
}

export const UserService: IUserService = {
  getByEmail: async (email: string): Promise<string> => {
    const user: firebase.auth.UserRecord = await firebase.auth().getUserByEmail(email);

    return user.uid;
  },
  getAllEmailsByUID: async (uids: string[]): Promise<string[]> => {
    const requests: any[] = uids.map((uid: string) => UserService.getEmailByUID(uid));
      
    return await axios.all(requests);
  },
  getEmailByUID: async (uid: string): Promise<string> => {
    const user: firebase.auth.UserRecord = await firebase.auth().getUser(uid);

    return user.email || "";
  },
  updateEmail: async (request: IUpdateUserEmailRequest, context: https.CallableContext): Promise<void> => {
    try {
      if(context.auth !== null) {
        logger.info(`Updating user [${request.uid}]'s email to [${request.email}]`);

        await firebase.auth().updateUser(request.uid, { email: request.email });
      }
    } catch (err) {
        logger.error(err);
    }
  }
}