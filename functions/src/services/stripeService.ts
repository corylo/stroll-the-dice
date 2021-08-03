import stripe from "stripe";

import { Stripe } from "../../config/stripe";

import { IConfirmPaymentRequest } from "../../../stroll-models/confirmPaymentRequest";

interface IStripeService {  
  createPaymentIntent: (amount: number) => Promise<string>;
  confirmPayment: (request: IConfirmPaymentRequest) => Promise<stripe.PaymentIntent>;
}

export const StripeService: IStripeService = {
  createPaymentIntent: async (amount: number): Promise<string> => {
    const paymentIntent: stripe.PaymentIntent = await Stripe.paymentIntents.create({
      amount,
      currency: "usd"
    });

    return paymentIntent.id;
  },
  confirmPayment: async (request: IConfirmPaymentRequest): Promise<stripe.PaymentIntent> => {
    return await Stripe.paymentIntents.confirm(request.intentID, {
      payment_method: request.paymentMethodID
    });
  }
}