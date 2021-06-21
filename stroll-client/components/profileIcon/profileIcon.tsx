import React from "react";

interface ProfileIconProps {
  anonymous?: boolean;
  color?: string;
  icon?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = (props: ProfileIconProps) => {  
  const getIcon = (): JSX.Element => {
    if(props.anonymous) {
      return (
        <i className="fal fa-question" style={{ color: "rgb(230, 230, 230)" }} />
      )
    }

    return (
      <i className={props.icon} style={{ color: `rgb(${props.color})` }} />
    )
  }

  return(
    <div className="profile-icon">
      {getIcon()}
    </div>
  )
}