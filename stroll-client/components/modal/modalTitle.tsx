import React from "react";

import { IconButton } from "../buttons/iconButton";

interface ModalTitleProps {  
  text?: string;
  children?: any;
  handleOnClose?: () => void;
}

export const ModalTitle: React.FC<ModalTitleProps> = (props: ModalTitleProps) => {
  const getChildren = (): any => {
    if(props.children) {
      return props.children;
    }
  }

  const getText = (): JSX.Element => {
    if(props.text) {
      return (
        <h1 className="passion-one-font">{props.text}</h1>
      )
    }
  }

  const getCloseButton = (): JSX.Element => {
    if(props.handleOnClose) {
      return (
        <IconButton 
          className="close-button"
          icon="fal fa-times" 
          handleOnClick={props.handleOnClose} 
        />
      )
    }
  }

  return (
    <div className="modal-title">
      {getText()}
      {getChildren()}
      {getCloseButton()}
    </div>
  );
}