import React from "react";

import { AcceptedPayments } from "../acceptedPayments/acceptedPayments";

import { StrollTheDiceCDN } from "../../../stroll-enums/strollTheDiceCDN";

interface PoweredByStripeProps {  
  
}

export const PoweredByStripe: React.FC<PoweredByStripeProps> = (props: PoweredByStripeProps) => {  
  return (    
    <div className="powered-by-stripe-wrapper">
      <h1 className="powered-by-stripe-label passion-one-font">Powered By</h1>
      <div className="powered-by-stripe">
        <a className="powered-by-stripe-logo" href="https://stripe.com/" target="_blank">          
          <img src={`${StrollTheDiceCDN.Url}/img/brands/stripe-logo.svg`} />        
        </a>
        <AcceptedPayments />
      </div>
    </div>
  );
}