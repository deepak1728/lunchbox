import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log("Stripe Key:", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
