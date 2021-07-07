import React from "react";

interface EmptyMessageProps {  
  text: string;
}

export const EmptyMessage: React.FC<EmptyMessageProps> = (props: EmptyMessageProps) => {  
  return (    
    <div className="empty-message">
      <h1 className="passion-one-font">{props.text}</h1>
    </div>
  );
}