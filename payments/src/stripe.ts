import Stripe from "stripe";
import { config } from "./config";

export const stripe = new Stripe(config.stripe.key, {
  apiVersion: "2020-08-27"
});
