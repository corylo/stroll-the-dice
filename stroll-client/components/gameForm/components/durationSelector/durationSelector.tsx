import React from "react";
import classNames from "classnames";

import { Button } from "../../../buttons/button";

import { GameDurationUtility } from "../../../../../stroll-utilities/gameDurationUtility";

import { GameDuration } from "../../../../../stroll-enums/gameDuration";

interface DurationSelectorProps {  
  selected: GameDuration;
  select: (duration: GameDuration) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = (props: DurationSelectorProps) => {  
  const getOptions = (): JSX.Element[] => {
    return GameDurationUtility.getDurations().map((duration: GameDuration) => {     
      const selected: boolean = duration === props.selected;

      return (
        <Button 
          key={duration}
          className={classNames("duration-selector-option", "fancy-option-button", "passion-one-font", { selected })}          
          handleOnClick={() => props.select(duration)} 
        >
          {GameDurationUtility.getLabel(duration)}
        </Button>
      )
    });
  }

  return (
    <div className="duration-selector">
      {getOptions()}
    </div>
  );
}