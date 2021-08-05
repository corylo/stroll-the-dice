import { config } from "firebase-functions";
import stripe from "stripe";

export const Stripe = new stripe(config().stripe.secret, { apiVersion: "2020-08-27" });
