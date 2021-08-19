import React, { useContext } from "react";
import classNames from "classnames";

import { EventDescription } from "../eventDescription/eventDescription";
import { EventType } from "../eventType/eventType";

import { AppContext } from "../../../../../components/app/contexts/appContext";

import { FirestoreDateUtility } from "../../../../../../stroll-utilities/firestoreDateUtility";
import { GameEventUtility } from "../../../../../../stroll-utilities/gameEventUtility";

import { IGameEvent } from "../../../../../../stroll-models/gameEvent/gameEvent";

import { Icon } from "../../../../../../stroll-enums/icon";
import { ProfileIcon } from "../../../../../components/profileIcon/profileIcon";

interface EventProps {  
  event: IGameEvent;
}

export const Event: React.FC<EventProps> = (props: EventProps) => {      
  const { user } = useContext(AppContext).appState;

  const { event } = props;
  
  const color: string = GameEventUtility.getColor(event.type, user.profile.color);

  const background: string = `linear-gradient(
    to right, 
    rgba(${color}, 0.1), 
    transparent 60%
  )`;

  const getEventIcon = (): JSX.Element => {
    const icon: Icon = GameEventUtility.getIcon(event.type);

    if(icon === Icon.ProfileIcon) {
      return (
        <ProfileIcon 
          color={user.profile.color}
          icon={user.profile.icon}
        />
      )
    }

    return (
      <i className={icon} style={{ color: `rgb(${color})` }} />
    )
  }

  return (
    <div className="game-event">
      <div className="game-event-icon">
        {getEventIcon()}      
      </div>
      <div className="game-event-color-indicator" style={{ backgroundColor: `rgb(${color})` }} />
      <div className="game-event-content" style={{ background }}>
        <div className="game-event-header">
          <EventType event={event} />
          <div className="game-event-time">
            <h1 className="passion-one-font">{FirestoreDateUtility.timestampToDate(event.occurredAt).toLocaleTimeString()}</h1>      
          </div>
        </div>
        <EventDescription event={event} />
      </div>
    </div>
  );
}