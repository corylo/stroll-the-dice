import React from "react";

interface EmptyMessageProps {  
  text: string;
  title?: string;
}

export const EmptyMessage: React.FC<EmptyMessageProps> = (props: EmptyMessageProps) => {  
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (
        <h1 className="empty-message-title passion-one-font">{props.title}</h1>
      )
    }
  }

  return (    
    <div className="empty-message">
      <div className="empty-message-content">
        {getTitle()}
        <h1 className="empty-message-text passion-one-font">{props.text}</h1>
      </div>
    </div>
  );
}