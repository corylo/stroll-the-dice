import React from "react";

import { Label } from "../../../../components/label/label";

interface ProfilePageSectionProps {  
  children: any;
  icon: string;
  title: string;
}

export const ProfilePageSection: React.FC<ProfilePageSectionProps> = (props: ProfilePageSectionProps) => {  
  return (
    <div className="profile-page-section">
      <Label className="profile-page-section-title" icon={props.icon} text={props.title} />
      <div className="profile-page-section-content">
      {props.children}
      </div>
    </div>
  );
}