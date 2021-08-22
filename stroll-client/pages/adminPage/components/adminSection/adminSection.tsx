import React from "react";
import classNames from "classnames";

interface AdminSectionProps {  
  children: any;
  className?: string;
  title: string;
}

export const AdminSection: React.FC<AdminSectionProps> = (props: AdminSectionProps) => {  
  return (
    <div className={classNames("admin-section", props.className)}>
      <h1 className="admin-section-title passion-one-font">{props.title}</h1>
      <div className="admin-section-content">
        {props.children}
      </div>
    </div>
  );
}