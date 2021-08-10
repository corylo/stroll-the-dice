import firebase from "firebase-admin";
import { EventContext, https, logger } from "firebase-functions";
import stripe from "stripe";

import { PaymentCompleteService } from "./paymentCompleteService";
import { StripeService } from "./stripeService";

import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { IConfirmPaymentRequest } from "../../../stroll-models/confirmPaymentRequest";
import { ICreatePaymentRequest } from "../../../stroll-models/createPaymentRequest";

import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { IPayment } from "../../../stroll-models/payment";
import { GameDayHistoryService } from "./gameDayHistoryService";
import { GameDayHistoryUtility } from "../utilities/gameDayHistoryUtility";
import { GameDayHistoryEntryType } from "../../../stroll-enums/gameDayHistoryEntryType";
import { GameDayUtility } from "../../../stroll-utilities/gameDayUtility";
import { IGameDayHistoryEntry } from "../../../stroll-models/gameDayHistoryEntry";

interface IPaymentService {
  confirmPayment: (request: IConfirmPaymentRequest, context: https.CallableContext) => Promise<void>;  
  createPayment: (request: ICreatePaymentRequest, context: https.CallableContext) => Promise<string>;    
  onCreate: (snapshot: firebase.firestore.QueryDocumentSnapshot, context: EventContext) => Promise<void>;
}

export const PaymentService: IPaymentService = {
  confirmPayment: async (request: IConfirmPaymentRequest, context: https.CallableContext): Promise<void> => {
    if(
      context.auth !== null && 
      request.intentID !== "" && 
      request.paymentMethodID !== ""
    ) {
      let intent: stripe.PaymentIntent = null;

      try {
        logger.info(`Confirming payment for user [${context.auth.uid}].`, { intentID: request.intentID });

        intent = await StripeService.confirmPayment(request);
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Payment confirmation failed due to an internal error.",
          err.message
        );
      }
      
      try {
        logger.info(`Payment successful for user [${context.auth.uid}]. Handling payment completion step.`, { intentID: request.intentID });

        await PaymentCompleteService.handlePaymentCompletion(context.auth.uid, intent);
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Handling of payment completion failed due to an internal error.",
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
  createPayment: async (request: ICreatePaymentRequest, context: https.CallableContext): Promise<string> => {
    if(
      context.auth !== null && 
      request.itemID !== PaymentItemID.None && 
      request.quantity !== 0
    ) {
      try {
        const price: number = PaymentUtility.getPrice(request.itemID),
          cents: number = price * 100;

        logger.info(`Creating payment intent for user [${context.auth.uid}]`, { 
          itemID: request.itemID, 
          price
        });

        return await StripeService.createPaymentIntent(cents, request.itemID);
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Payment creation failed due to an internal error.",
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
    const payment: IPayment = snapshot.data() as IPayment;

    try {      
      const entry: IGameDayHistoryEntry = GameDayHistoryUtility.mapCreate(
        "",
        payment.createdAt, 
        GameDayUtility.getDayQuantity(GameDayUtility.getGameDayPurchaseOptionUnit(payment.itemID)), 
        "", 
        GameDayHistoryEntryType.Received
      );

      await GameDayHistoryService.create(context.params.profileID, entry);
    } catch (err) {
      logger.error(err);
    }
  }
}