import firebase from "firebase-admin";
import { logger } from "firebase-functions";

import { db } from "../../config/firebase";

import { NotificationTransactionService } from "./transaction/notificationTransactionService";
import { PaymentHistoryTransactionService } from "./transaction/paymentHistoryTransactionService";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";
import { NotificationUtility } from "../utilities/notificationUtility";
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { IGameDayStatsUpdate } from "../../../stroll-models/gameDayStatsUpdate";
import { IPayment } from "../../../stroll-models/payment";
import { IProfileGameDayStats } from "../../../stroll-models/profileStats";

import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";
import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { ProfileStatsID } from "../../../stroll-enums/profileStatsID";

interface IPaymentCompleteService {
  handleGameDayPurchase: (uid: string, itemID: PaymentItemID, checkoutSessionID: string, price: number) => Promise<void>;
  handlePaymentCompletion: (uid: string, itemID: string, checkoutSessionID: string) => Promise<void>;
}

export const PaymentCompleteService: IPaymentCompleteService = {
  handleGameDayPurchase: async (uid: string, itemID: PaymentItemID, checkoutSessionID: string, price: number): Promise<void> => {
    const unit: GameDayPurchaseOptionUnit = GameDayUtility.getGameDayPurchaseOptionUnit(itemID),        
      quantity: number = GameDayUtility.getDayQuantity(unit);

    logger.info(`Handling payment completion for user: [${uid}].`, {
      checkoutSessionID,
      unit,
      quantity
    });

    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const profileStatsRef: firebase.firestore.DocumentReference = db.collection("profiles")      
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.GameDays);

      const paymentRef: firebase.firestore.Query = db.collection("profiles")      
        .doc(uid)
        .collection("payments")
        .where("checkoutSessionID", "==", checkoutSessionID);
      
      const profileStatsDoc: firebase.firestore.DocumentSnapshot = await transaction.get(profileStatsRef),
        paymentSnap: firebase.firestore.QuerySnapshot = await transaction.get(paymentRef);

      if(!paymentSnap.empty) {
        throw new Error(`An entry for checkoutSessionID [${checkoutSessionID}] already exists for user: [${uid}]`);
      } else if(profileStatsDoc.exists) {
        const stats: IProfileGameDayStats = profileStatsDoc.data() as IProfileGameDayStats,
          update: IGameDayStatsUpdate = { 
            available: stats.available + quantity, 
            total: stats.total + quantity 
          };

        transaction.update(profileStatsRef, update);

        const payment: IPayment = {
          amount: price,          
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          checkoutSessionID,
          id: "",
          itemID
        };

        PaymentHistoryTransactionService.create(transaction, uid, payment);

        NotificationTransactionService.create(transaction, uid, NotificationUtility.mapCreate([
            "For more information on how to use or share your Game Days, check out the How To Play page by clicking on this notification.",
            NotificationUtility.getRandomGoodLuckStatement()
          ],
          `You purchased ${itemID} from the store!`,
          payment.createdAt,
          "how-to-play#game-days"
        ))
      } else {
        throw new Error(`Document with Profile Stats ID: [${ProfileStatsID.GameDays}] does not exist for user: [${uid}]`);
      }
    });
  },
  handlePaymentCompletion: async (uid: string, itemID: string, checkoutSessionID: string): Promise<void> => {
    const paymentItemID: PaymentItemID = PaymentUtility.getItemID(itemID),
      price: number = PaymentUtility.getPrice(paymentItemID);

    if(GameDayUtility.isGameDayPurchase(paymentItemID)) {
      await PaymentCompleteService.handleGameDayPurchase(uid, paymentItemID, checkoutSessionID, price);
    }
  }
}