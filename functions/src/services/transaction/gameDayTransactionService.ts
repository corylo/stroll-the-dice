import firebase from "firebase-admin";
import { https, logger } from "firebase-functions";

import { db } from "../../../config/firebase";

import { AdminService } from "../adminService";
import { FriendIDService } from "../friendIDService";
import { GameDayHistoryTransactionService } from "./gameDayHistoryTransactionService";
import { NotificationTransactionService } from "./notificationTransactionService";
import { UserService } from "../userService";

import { GameDayHistoryUtility } from "../../utilities/gameDayHistoryUtility";
import { NotificationUtility } from "../../utilities/notificationUtility";
import { ProfileUtility } from "../../utilities/profileUtility";

import { IGameDayHistoryGiftEntry } from "../../../../stroll-models/gameDayHistoryEntry/gameDayHistoryGiftEntry";
import { IGameDayStatsUpdate } from "../../../../stroll-models/gameDayStatsUpdate";
import { IGiftGameDaysRequest } from "../../../../stroll-models/giftGameDaysRequest";
import { IProfileGameDayStats } from "../../../../stroll-models/profileStats";

import { ProfileStatsID } from "../../../../stroll-enums/profileStatsID";

interface IGameDayTransactionService {
  giftGameDays: (request: IGiftGameDaysRequest, context: https.CallableContext) => Promise<void>;
  update: (transaction: firebase.firestore.Transaction, ref: firebase.firestore.DocumentReference, stats: IProfileGameDayStats, quantity: number) => void;
}

export const GameDayTransactionService: IGameDayTransactionService = {
  giftGameDays: async  (request: IGiftGameDaysRequest, context: https.CallableContext): Promise<void> => {
    try {
      if(context.auth !== null) {
        const isAdmin: boolean = await AdminService.checkIfAdmin(context.auth.uid);

        if(isAdmin) {
          try {
            const getTargetUID = async (): Promise<string> => {
              if(ProfileUtility.validFriendID(request.id)) {
                return await FriendIDService.getUIDByFriendID(request.id);
              } else if (ProfileUtility.validEmail(request.id)) {
                return await UserService.getByEmail(request.id);
              }

              throw new Error("Invalid email or friend ID.");
            }

            const targetUID: string = await getTargetUID();

            logger.info(`Gifting [${request.quantity}] game days from user [${context.auth.uid}] to user [${targetUID}].`);          
            
            await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
              const profileStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
                .doc(targetUID)
                .collection("stats")
                .doc(ProfileStatsID.GameDays);
                
              const profileStatsDoc: firebase.firestore.DocumentSnapshot = await transaction.get(profileStatsRef);
          
              const stats: IProfileGameDayStats = profileStatsDoc.data() as IProfileGameDayStats;
          
              GameDayTransactionService.update(transaction, profileStatsRef, stats, request.quantity);

              const timestamp: firebase.firestore.FieldValue = firebase.firestore.FieldValue.serverTimestamp();

              const entry: IGameDayHistoryGiftEntry = GameDayHistoryUtility.mapGameDayHistoryGiftEntry(
                timestamp,
                request.quantity,
                context.auth.uid,
                targetUID
              )
              
              GameDayHistoryTransactionService.create(transaction, targetUID, entry);

              if(context.auth.uid !== targetUID) {
                GameDayHistoryTransactionService.create(transaction, context.auth.uid, entry);
              }

              NotificationTransactionService.create(transaction, targetUID, NotificationUtility.mapCreate(
                `You've been gifted ${request.quantity} game days!`,
                `You received a gift!`,
                timestamp
              ));
            });
          } catch (err) {
            logger.error(err);
      
            throw new https.HttpsError(
              "internal",
              "Request failed due to an internal error."
            );
          }
        }
      }
    } catch (err) {
      logger.error(err);

      throw new https.HttpsError(
        "permission-denied",
        "User does not have permission to perform this action."
      );
    }
  },
  update: (transaction: firebase.firestore.Transaction, ref: firebase.firestore.DocumentReference, stats: IProfileGameDayStats, quantity: number): void => {
    const update: IGameDayStatsUpdate = { 
      available: stats.available + quantity, 
      total: stats.total + quantity 
    };

    transaction.update(ref, update);
  }
}