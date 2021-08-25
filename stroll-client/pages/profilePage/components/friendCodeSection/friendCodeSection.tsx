import React from "react";

import { CopyButton } from "../../../../components/copyButton/copyButton";
import { ProfilePageSection } from "../profilePageSection/profilePageSection";

import { Icon } from "../../../../../stroll-enums/icon";
import { TooltipSide } from "../../../../components/tooltip/tooltip";

interface FriendCodeSectionProps {  
  friendID: string;
}

export const FriendCodeSection: React.FC<FriendCodeSectionProps> = (props: FriendCodeSectionProps) => {  
  return (
    <ProfilePageSection className="friend-code-section" icon={Icon.User} title="Friend Code">
      <div className="friend-code">
        <h1 className="passion-one-font">{props.friendID}</h1>                 
        <CopyButton
          icon="fal fa-link"
          tooltip=""
          tooltipSide={TooltipSide.Left}
          value={props.friendID}
        />
      </div>
    </ProfilePageSection>
  );
}