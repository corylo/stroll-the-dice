import React from "react";

import { Button } from "../../components/buttons/button";

interface PageMessageActionProps {    
  children: any;
  handleOnClick: () => void;  
}

export const PageMessageAction: React.FC<PageMessageActionProps> = (props: PageMessageActionProps) => {  
  return (
    <Button className="page-message-action passion-one-font" handleOnClick={props.handleOnClick}>
      {props.children}
    </Button>
  );
}