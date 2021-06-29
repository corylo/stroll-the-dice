import React from "react";

interface ProfileIconProps {
  color?: string;
  icon?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = (props: ProfileIconProps) => {  
  return(
    <div className="profile-icon">
      <i className={props.icon} style={{ color: `rgb(${props.color})` }} />
    </div>
  )
}