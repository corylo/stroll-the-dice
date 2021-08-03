import Stripe from "@stripe/stripe-js";

import { IPaymentBillingFields } from "../../stroll-models/paymentBillingFields";
import { IStripeBillingDetails } from "../../stroll-models/stripe/stripeBillingDetails";

interface IPaymentFormUtility {
  getCreditCardInputOptions: () => Stripe.StripeCardElementOptions;
  mapStripeBillingDetails: (fields: IPaymentBillingFields) => IStripeBillingDetails;
}

export const PaymentFormUtility: IPaymentFormUtility = {
  getCreditCardInputOptions: (): Stripe.StripeCardElementOptions => {
    return {
      hidePostalCode: true,
      style: {
        base: {
          color: "white",
          iconColor: "white",
          fontSize: "16px",
          fontWeight: "bold",
          "::placeholder": {
            color: "rgba(255, 255, 255, 0.6)"
          }
        },
        invalid: {
          color: "rgb(239, 83, 80)",
          iconColor: "rgb(239, 83, 80)"
        },
        complete: {
          iconColor: "rgb(42, 252, 152)"
        }
      }
    }
  },
  mapStripeBillingDetails: (fields: IPaymentBillingFields): IStripeBillingDetails => {
    return {
      address: {
        city: fields.address.city.trim(),
        line1: fields.address.line1.trim(),
        line2: fields.address.line2.trim(),
        postal_code: fields.address.zip.trim(),
        state: fields.address.state.trim()
      },
      email: fields.email.trim(),
      name: fields.name.trim()   
    }
  }
}