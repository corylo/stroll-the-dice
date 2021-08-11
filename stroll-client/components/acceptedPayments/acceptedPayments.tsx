import React from "react";
import classNames from "classnames";

interface AcceptedPaymentsProps {  
  
}

export const AcceptedPayments: React.FC<AcceptedPaymentsProps> = (props: AcceptedPaymentsProps) => {  
  const icons: string[] = [
    "fab fa-google-pay",
    "fab fa-apple-pay"
  ];

  const getPayments = (): JSX.Element[] => {
    return icons.map((icon: string) => <i key={icon} className={classNames("accepted-payment", icon)} />);
  }

  return (    
    <div className = "accepted-payments">
      {getPayments()}
    </div>
  );
}