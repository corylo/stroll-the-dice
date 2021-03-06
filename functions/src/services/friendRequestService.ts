import firebase from "firebase-admin";
import { EventContext, logger } from "firebase-functions";

import { NotificationBatchService } from "./batch/notificationBatchService";
import { ProfileService } from "./profileService";

import { NotificationUtility } from "../utilities/notificationUtility";

import { IFriendRequest} from "../../../stroll-models/friendRequest";
import { IProfile } from "../../../stroll-models/profile";

import { FriendRequestType } from "../../../stroll-enums/friendRequestType";

interface IFriendRequestService {
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>; 
}

export const FriendRequestService: IFriendRequestService = {
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const request: IFriendRequest = { ...snapshot.data(), uid: snapshot.id } as IFriendRequest;

    if(request.type === FriendRequestType.Incoming) {      
      try {
        const profile: IProfile = await ProfileService.get.by.uid(request.uid);

        await NotificationBatchService.create(context.params.profileID, NotificationUtility.mapCreate(
          "Click on this notification to view your friend requests.",
          `${profile.username} has sent you a friend request!`,
          profile.createdAt,
          "profile/friends"
        ));
      } catch (err) {
        logger.error(err);
      }
    }
  }
}