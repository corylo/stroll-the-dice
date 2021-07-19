import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";

import { PointStatement } from "../../../../components/pointStatement/pointStatement";

import { GamePageContext } from "../../gamePage";

import { useCurrentDateEffect } from "../../../../effects/appEffects";

import { GameEventUtility } from "../../../../../stroll-utilities/gameEventUtility";

import { Icon } from "../../../../../stroll-enums/icon";

interface MyPointsUpdateProps {  
  
}

export const MyPointsUpdate: React.FC<MyPointsUpdateProps> = (props: MyPointsUpdateProps) => {    
  const { playerSteps } = useContext(GamePageContext).state;

  const getLastViewedStepCount = (): number => {
    const count: string = GameEventUtility.getLastViewedStepCount();

    return count ? parseInt(count) : 0;
  }

  const [lastViewedStepCount, setLastViewedStepCount] = useState<number>(getLastViewedStepCount()),
    [lastViewedAt, setLastViewedAt] = useState<Date>(null);

  useCurrentDateEffect();

  useEffect(() => {   
    const count: string = GameEventUtility.getLastViewedStepCount();

    if(playerSteps > 0 && (count === null || parseInt(count) < playerSteps)) {
      GameEventUtility.setLastViewedStepCount(playerSteps);      

      setLastViewedAt(new Date());
    }
  }, [playerSteps]);

  const getSeconds = (): number => {
    if(lastViewedAt) {      
      const millis: number = new Date().getTime() - lastViewedAt.getTime();

      return millis / 1000;
    }

    return 1000000;
  }

  const seconds: number = getSeconds();

  const getContent = (): JSX.Element => {
    if(playerSteps > 0) {
      return (
        <React.Fragment>
          <div className="my-points-update-border" />
          <div className="my-points-update-content">
            <i className={Icon.Steps} />
            <h1 className="passion-one-font">You earned <PointStatement amount={(playerSteps).toLocaleString()} /> from steps!</h1>
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