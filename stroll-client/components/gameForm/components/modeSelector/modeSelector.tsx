import React from "react";
import classNames from "classnames";

import { Button } from "../../../buttons/button";

import { GameModeUtility } from "../../../../utilities/gameModeUtility";

import { GameMode } from "../../../../../stroll-enums/gameMode";

interface ModeSelectorProps {  
  selected: GameMode;
  select: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = (props: ModeSelectorProps) => {  
  const getOptions = (): JSX.Element[] => {
    return GameModeUtility.getModes().map((mode: GameMode) => {     
      const selected: boolean = mode === props.selected;

      return (
        <Button 
          key={mode}
          className={classNames("mode-selector-option", "fancy-option-button", { selected })}          
          handleOnClick={() => props.select(mode)} 
        >
          <i className={GameModeUtility.getIcon(mode)} />
          <h1 className="passion-one-font">{mode}</h1>
        </Button>
      )
    });
  }

  return (
    <div className="mode-selector">
      {getOptions()}
    </div>
  );
}