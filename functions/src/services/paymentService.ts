import firebase from "firebase-admin";
import { EventContext, https, logger } from "firebase-functions";

import { GameDayHistoryService } from "./gameDayHistoryService";
import { StripeService } from "./stripeService";

import { GameDayHistoryUtility } from "../utilities/gameDayHistoryUtility";
import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { ICreatePaymentRequest } from "../../../stroll-models/createPaymentRequest";
import { IGameDayHistoryPurchaseEntry } from "../../../stroll-models/gameDayHistoryEntry/gameDayHistoryPurchaseEntry";
import { IPayment } from "../../../stroll-models/payment";

import { PaymentItemID } from "../../../stroll-enums/paymentItemID";

interface IPaymentService {  
  createPaymentSession: (request: ICreatePaymentRequest, context: https.CallableContext) => Promise<string>;    
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
}

export const PaymentService: IPaymentService = {  
  createPaymentSession: async (request: ICreatePaymentRequest, context: https.CallableContext): Promise<string> => {
    if(
      context.auth !== null && 
      request.itemID !== PaymentItemID.None && 
      request.quantity !== 0
    ) {
      try {
        const price: number = PaymentUtility.getPrice(request.itemID),
          cents: number = price * 100;

        logger.info(`Creating payment session for user [${context.auth.uid}]`, { 
          itemID: request.itemID, 
          price
        });

        return await StripeService.createPaymentSession(context.auth.uid, cents, request.itemID);
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Payment session creation failed due to an internal error.",
          err.message
        );
      }
    } else {
      throw new https.HttpsError(
        "permission-denied",
        "User does not have permission to perform this action."
      );
    }
  },
  onCreate: async (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext): Promise<void> => {
    const payment: IPayment = { ...snapshot.data() as IPayment, id: snapshot.id };

    try {    
      const quantity: number = GameDayUtility.getDayQuantity(GameDayUtility.getGameDayPurchaseOptionUnit(payment.itemID));

      const entry: IGameDayHistoryPurchaseEntry = GameDayHistoryUtility.mapGameDayHistoryPurchaseEntry(
        payment.createdAt,
        quantity,
        payment.id
      );

      await GameDayHistoryService.create(context.params.profileID, entry);
    } catch (err) {
      logger.error(err);
    }
  }
}