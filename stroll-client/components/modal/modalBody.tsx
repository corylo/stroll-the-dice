import React from "react";

interface ModalBodyProps {  
  children: any;
}

export const ModalBody: React.FC<ModalBodyProps> = (props: ModalBodyProps) => {  
  return (
    <div className="modal-body">
      {props.children}
    </div>
  );
}