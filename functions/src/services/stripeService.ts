import { config, https, logger } from "firebase-functions";
import stripe from "stripe";

import { Stripe } from "../../config/stripe";

import { PaymentCompleteService } from "./paymentCompleteService";

import { PaymentUtility } from "../../../stroll-utilities/paymentUtility";
import { UrlUtility } from "../utilities/urlUtility";

import { PaymentItemID } from "../../../stroll-enums/paymentItemID";

interface IStripeService {  
  createPaymentSession: (uid: string, amount: number, itemID: PaymentItemID) => Promise<string>;
  paymentWebhook: (req: https.Request, res: any) => Promise<void>;
}

export const StripeService: IStripeService = {
  createPaymentSession: async (uid: string, amount: number, itemID: PaymentItemID): Promise<string> => {
    const session: stripe.Checkout.Session = await Stripe.checkout.sessions.create({
      line_items: [{
        description: itemID,
        price_data: {
          currency: "usd",
          product_data: {
            name: itemID,
            images: [PaymentUtility.getImage(itemID)]
          },
          unit_amount: amount
        },
        quantity: 1
      }],
      metadata: {
        itemID,
        uid
      },
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${UrlUtility.getOriginUrl()}/shop?id=${PaymentUtility.getItemUrlID(itemID)}&success=true`,
      cancel_url: `${UrlUtility.getOriginUrl()}/shop?id=${PaymentUtility.getItemUrlID(itemID)}&error=true`
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

      const object: stripe.Checkout.Session = event.data.object as stripe.Checkout.Session;

      if(object.payment_status === "paid") {
        await PaymentCompleteService.handlePaymentCompletion(
          object.metadata.uid, 
          object.metadata.itemID,
          object.id
        );
      }

      return res.sendStatus(200);
    } catch (err) {
      logger.error(err);
    }
  }
}