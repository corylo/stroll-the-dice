import React from "react";

interface PageTitleProps {  
  text?: string;
  children?: any;
  handleOnClose?: () => void;
}

export const PageTitle: React.FC<PageTitleProps> = (props: PageTitleProps) => {
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

  return (
    <div className="page-title">
      {getText()}
      {getChildren()}
    </div>
  );
}