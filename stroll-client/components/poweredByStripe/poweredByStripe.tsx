import React from "react";

import { AcceptedPayments } from "../acceptedPayments/acceptedPayments";

interface PoweredByStripeProps {  
  
}

export const PoweredByStripe: React.FC<PoweredByStripeProps> = (props: PoweredByStripeProps) => {  
  return (    
    <a className="powered-by-stripe-logo" href="https://stripe.com/" target="_blank">
      <h1 className="passion-one-font">Payments Processed By</h1>
      <img src="/img/brands/stripe-logo.svg" />
      <AcceptedPayments />
    </a>
  );
}