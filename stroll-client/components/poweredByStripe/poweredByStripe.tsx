import React from "react";

interface PoweredByStripeProps {  
  
}

export const PoweredByStripe: React.FC<PoweredByStripeProps> = (props: PoweredByStripeProps) => {  
  return (    
    <a className="powered-by-stripe-logo" href="https://stripe.com/" target="_blank">
      <img src="/img/brands/powered-by-stripe-logo.svg" />
    </a>
  );
}