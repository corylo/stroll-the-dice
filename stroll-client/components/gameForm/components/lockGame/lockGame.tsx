import React from "react";

import { InputToggle } from "../../../inputToggle/inputToggle";

interface LockGameProps {  
  locked: boolean;
  toggle: (locked: boolean) => void;
}

export const LockGame: React.FC<LockGameProps> = (props: LockGameProps) => {  
  return (
    <InputToggle
      className="lock-game-toggle"
      description="Enabling this feature will prevents more players from joining. Games will lock automatically after the start time."
      icon="fal fa-lock-alt"
      label="Lock Game"
      toggled={props.locked}
      toggle={() => props.toggle(!props.locked)}
    />
  );
}