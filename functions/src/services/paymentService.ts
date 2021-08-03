import { https, logger } from "firebase-functions";

import { StripeService } from "./stripeService";

import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

import { IConfirmPaymentRequest } from "../../../stroll-models/confirmPaymentRequest";
import { ICreatePaymentRequest } from "../../../stroll-models/createPaymentRequest";

interface IPaymentService {
  confirmPayment: (request: IConfirmPaymentRequest, context: https.CallableContext) => Promise<void>;
  createPayment: (request: ICreatePaymentRequest, context: https.CallableContext) => Promise<string>;
}

export const PaymentService: IPaymentService = {
  confirmPayment: async (request: IConfirmPaymentRequest, context: https.CallableContext): Promise<void> => {
    if(context.auth !== null) {
      try {
        logger.info(`Confirming payment intent for user [${context.auth.uid}].`);

        await StripeService.confirmPayment(request);
      } catch (err) {
        logger.error(err);
    
        throw new https.HttpsError(
          "internal",
          "Payment confirmation failed due to an internal error.",
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
    if(context.auth !== null) {
      try {
        const price: number = PaymentUtility.getPrice(request.itemID);

        logger.info(`Creating payment intent for user [${context.auth.uid}] for item: [${request.itemID}] for price: [$${price}]`);

        return await StripeService.createPaymentIntent(price * 100);
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
  }
}