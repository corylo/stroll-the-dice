import { config, https, logger } from "firebase-functions";
import stripe from "stripe";

import { Stripe } from "../../config/stripe";

import { PaymentCompleteService } from "./paymentCompleteService";

import { PaymentItemID } from "../../../stroll-enums/paymentItemID";
import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";

interface IStripeService {  
  createPaymentSession: (uid: string, amount: number, itemID: PaymentItemID) => Promise<string>;
  paymentWebhook: (req: https.Request, res: any) => Promise<void>;
}

export const StripeService: IStripeService = {
  createPaymentSession: async (uid: string, amount: number, itemID: PaymentItemID): Promise<string> => {
    const session: stripe.Checkout.Session = await Stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: itemID
          },
          unit_amount: amount
        },
        images: [
          PaymentUtility.getImage(itemID)
        ],
        quantity: 1
      }],
      metadata: {
        itemID,
        uid
      },
      mode: "payment",
      payment_method_types: ["card"],
      success_url: "https://strollthedice.com/shop",
      cancel_url: "https://strollthedice.com/shop"
    });

    return session.url;
  },
  paymentWebhook: async (req: https.Request, res: any): Promise<void> => {
    try {
      const event: stripe.Event = Stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers["stripe-signature"],
        config().stripe.payment_webhook_secret
      );

      event.type === ""

      const { object } = event.data as any;

      await PaymentCompleteService.handlePaymentCompletion(
        object.metadata.uid, 
        object.metadata.itemID,
        object.id
      );

      return res.sendStatus(200);
    } catch (err) {
      logger.error(err);
    }
  }
}