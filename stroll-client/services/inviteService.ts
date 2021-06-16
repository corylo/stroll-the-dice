import { db } from "../firebase";

import { IInvite, inviteConverter } from "../../stroll-models/invite";

interface IInviteService {
  create: (invite: IInvite) => Promise<void>;
}

export const InviteService: IInviteService = {
  create: async (invite: IInvite): Promise<void> => {
    await db.collection("invites")      
      .withConverter(inviteConverter)
      .add(invite);

    return;
  }
}