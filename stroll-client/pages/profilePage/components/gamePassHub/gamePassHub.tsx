import React, { useContext } from "react";

import { Button } from "../../../../components/buttons/button";

import { AppContext } from "../../../../components/app/contexts/appContext";

import { Icon } from "../../../../../stroll-enums/icon";

interface GamePassHubProps {  
  
}

export const GamePassHub: React.FC<GamePassHubProps> = (props: GamePassHubProps) => {  
  const { appState } = useContext(AppContext);

  const { user } = appState;

  const handleGetGamePasses = (): void => {

  }

  return (
    <div className="game-pass-hub">
      <Button className="get-game-passes-button" handleOnClick={handleGetGamePasses}>
        <i className={Icon.GamePass} />
        <h1 className="passion-one-font">Get Game Passes!</h1>
      </Button>
    </div>
  );
}