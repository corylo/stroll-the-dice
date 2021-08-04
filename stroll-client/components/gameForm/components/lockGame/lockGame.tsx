import React from "react";
import classNames from "classnames";

import { Button } from "../../../buttons/button";

interface LockGameProps {  
  locked: boolean;
  toggle: (locked: boolean) => void;
}

export const LockGame: React.FC<LockGameProps> = (props: LockGameProps) => {  
  const getIcon = (): string => {
    if(props.locked) {
      return "fad fa-lock-alt";
    }

    return "fad fa-unlock-alt";
  }

  const getText = (): string => {
    if(props.locked) {
      return "Game is locked";
    }

    return "Game is unlocked";
  }

  return (
    <div className="lock-game">
      <Button 
        className={classNames("lock-game-button", "fancy-option-button", { selected: props.locked })}          
        handleOnClick={() => props.toggle(!props.locked)} 
      >
        <i className={getIcon()} />
        <h1 className="passion-one-font">{getText()}</h1>
      </Button>
      <h1 className="lock-game-label passion-one-font">
        Locking a game prevents more players from joining. Games will lock automatically after the start time.
      </h1>
    </div>
  );
}