import React from "react";
import classNames from "classnames";

interface ShopSectionProps {  
  children: any;
  className?: string;
  description?: string[];
  title?: string;
}

export const ShopSection: React.FC<ShopSectionProps> = (props: ShopSectionProps) => {  
  const getTitle = (): JSX.Element => {
    if(props.title) {
      return (
        <h1 className="shop-section-title passion-one-font">{props.title}</h1>
      )
    }
  }

  const getDesc = (): JSX.Element => {
    if(props.description) {
      const lines: JSX.Element[] = props.description.map((line: string) => (
        <h1 key={line} className="shop-section-description-line passion-one-font">{line}</h1>
      ));

      return (
        <div className="shop-section-description">
          {lines}
        </div>
      )
    }
  }

  return (
    <div className={classNames("shop-section", props.className)}>
      {getTitle()}
      {getDesc()}
      <div className="shop-section-content">
        {props.children}
      </div>
    </div>
  );
}