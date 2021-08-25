import React from "react";
import classNames from "classnames";

import { Label } from "../../../../components/label/label";

interface ProfilePageSectionProps {  
  children: any;
  className?: string;
  icon: string;
  title: string;
}

export const ProfilePageSection: React.FC<ProfilePageSectionProps> = (props: ProfilePageSectionProps) => {  
  return (
    <div className={classNames("profile-page-section", props.className)}>
      <Label className="profile-page-section-title" icon={props.icon} text={props.title} />
      <div className="profile-page-section-content">
      {props.children}
      </div>
    </div>
  );
}