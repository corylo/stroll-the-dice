import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { useCurrentDateEffect } from "../../../../effects/appEffects";

import { GamePageContext } from "../../gamePage";

import { FirestoreDateUtility } from "../../../../../stroll-utilities/firestoreDateUtility";

import { IGameEvent } from "../../../../../stroll-models/gameEvent/gameEvent";
import { IPlayerEarnedPointsFromStepsEvent } from "../../../../../stroll-models/gameEvent/playerEarnedPointsFromStepsEvent";

import { GameEventType } from "../../../../../stroll-enums/gameEventType";
import { Icon } from "../../../../../stroll-enums/icon";

interface MyPointsUpdateProps {  
  
}

export const MyPointsUpdate: React.FC<MyPointsUpdateProps> = (props: MyPointsUpdateProps) => {    
  const { events } = useContext(GamePageContext).state;

  useCurrentDateEffect();

  const [event, setEvent] = useState<IPlayerEarnedPointsFromStepsEvent>(null);

  useEffect(() => {
    if(events.length > 0) {
      const gameEvent: IGameEvent = events[0];

      if(gameEvent.type === GameEventType.PlayerEarnedPointsFromSteps) {      
        setEvent(gameEvent as IPlayerEarnedPointsFromStepsEvent);
      }
    }
  }, [events]);

  const getSeconds = (): number => {
    if(event) {
      const millis: number = new Date().getTime() - FirestoreDateUtility.timestampToDate(event.occurredAt).getTime();

      return millis / 1000;
    }

    return 1000000;
  }

  const seconds: number = getSeconds();

  const getContent = (): JSX.Element => {
    if(event) {
      return (
        <React.Fragment>
          <div className="my-points-update-border" />
          <div className="my-points-update-content">
            <i className={Icon.Steps} />
            <h1 className="passion-one-font">You earned <PointStatement amount={event.points.toLocaleString()} /> from steps!</h1>
          </div>              
        </React.Fragment>
      );
    }
  }

  const content: JSX.Element = getContent(),
    visible: boolean = seconds < 10;
  
  return (    
    <div className={classNames("my-points-update", { visible })}>
      {content}
    </div>
  );
}