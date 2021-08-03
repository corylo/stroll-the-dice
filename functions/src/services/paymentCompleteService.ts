import firebase from "firebase-admin";
import { logger } from "firebase-functions";
import stripe from "stripe";

import { db } from "../../config/firebase";

import { PaymentHistoryTransactionService } from "./transaction/paymentHistoryTransactionService";

import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility"
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { IGameDayStatsUpdate } from "../../../stroll-models/gameDayStatsUpdate";
import { IPayment } from "../../../stroll-models/payment";
import { IProfileGameDayStats } from "../../../stroll-models/profileStats";

import { GameDayPurchaseOptionUnit } from "../../../stroll-enums/gameDayPurchaseOptionUnit";
import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { ProfileStatsID } from "../../../stroll-enums/profileStatsID";

interface IPaymentCompleteService {
  handleGameDayPurchase: (uid: string, itemID: PaymentItemID, intentID: string, price: number) => Promise<void>;
  handlePaymentCompletion: (uid: string, intent: stripe.PaymentIntent) => Promise<void>;
}

export const PaymentCompleteService: IPaymentCompleteService = {
  handleGameDayPurchase: async (uid: string, itemID: PaymentItemID, intentID: string, price: number): Promise<void> => {
    const unit: GameDayPurchaseOptionUnit = GameDayUtility.getGameDayPurchaseOptionUnit(itemID),        
      quantity: number = GameDayUtility.getDayQuantity(unit);

    logger.info(`Handling payment completion for user: [${uid}].`, {
      intentID,
      unit,
      quantity
    });

    await db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const ref: firebase.firestore.DocumentReference = db.collection("profiles")      
        .doc(uid)
        .collection("stats")
        .doc(ProfileStatsID.GameDays);
      
      const doc: firebase.firestore.DocumentSnapshot = await transaction.get(ref);

      if(doc.exists) {
        const stats: IProfileGameDayStats = doc.data() as IProfileGameDayStats,
          update: IGameDayStatsUpdate = { 
            available: stats.available + quantity, 
            total: stats.total + quantity 
          };

        transaction.update(ref, update);

        const payment: IPayment = {
          amount: price,          
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          id: "",
          intentID,
          itemID
        };

        PaymentHistoryTransactionService.create(transaction, uid, payment);
      } else {
        throw new Error(`Document with Profile Stats ID: [${ProfileStatsID.GameDays}] does not exist for user: [${uid}]`);
      }
    });
  },
  handlePaymentCompletion: async (uid: string, intent: stripe.PaymentIntent): Promise<void> => {
    const itemID: PaymentItemID = PaymentUtility.getItemID(intent.description),
      price: number = PaymentUtility.getPrice(itemID);

    if(GameDayUtility.isGameDayPurchase(itemID)) {
      await PaymentCompleteService.handleGameDayPurchase(uid, itemID, intent.id, price);
    }
  }
}