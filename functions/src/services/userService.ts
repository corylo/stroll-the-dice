import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";

import { IUpdateUserEmailRequest } from "../../../stroll-models/updateUserEmailRequest";

interface IUserService {
  getByEmail: (email: string) => Promise<string>;
  updateEmail: (request: IUpdateUserEmailRequest, context: https.CallableContext) => Promise<void>;
}

export const UserService: IUserService = {
  getByEmail: async (email: string): Promise<string> => {
    const user: firebase.auth.UserRecord = await firebase.auth().getUserByEmail(email);

    return user.uid;
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