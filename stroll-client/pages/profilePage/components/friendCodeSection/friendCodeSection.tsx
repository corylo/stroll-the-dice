import React from "react";
import { Link } from "react-router-dom";

import { CopyButton } from "../../../../components/copyButton/copyButton";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";

import { Icon } from "../../../../../stroll-enums/icon";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

interface FriendCodeSectionProps {  
  friendID: string;
}

export const FriendCodeSection: React.FC<FriendCodeSectionProps> = (props: FriendCodeSectionProps) => {  
  return (
    <ProfilePageSection className="friend-code-section" icon={Icon.User} title="Friends">
      <div className="friend-code-wrapper">
        <div className="friend-code">
          <h1 className="friend-code-value passion-one-font">{props.friendID}</h1>                 
          <h1 className="friend-code-label passion-one-font">My Friend Code</h1>                 
        </div>
        <CopyButton
          icon="fal fa-link"
          tooltip=""
          tooltipSide={TooltipSide.Left}
          value={props.friendID}
        />
      </div>
      <div className="friend-actions">
        <Link
          className="button link fancy-button"            
          to="/friends"
        >
          <i className="fal fa-user-friends" />
          <h1 className="passion-one-font">View Friends</h1>
        </Link>
        <Link
          className="button link fancy-button"            
          to="/friends"
        >
          <i className="fal fa-plus" />
          <h1 className="passion-one-font">Add Friend</h1>
        </Link>
      </div>
    </ProfilePageSection>
  );
}