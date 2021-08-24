import React from "react";

interface PageFooterSectionProps {  
  children: any;
  title: string;
}

export const PageFooterSection: React.FC<PageFooterSectionProps> = (props: PageFooterSectionProps) => {  
  return (
    <div className="page-footer-section">
      <h1 className="page-footer-section-title passion-one-font">{props.title}</h1>
      <div className="page-footer-section-content">
        {props.children}
      </div>
    </div>
  );
}