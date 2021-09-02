import React from "react";

import { GamePageContext } from "../../pages/gamePage/gamePage";
import { Matchup } from "../../pages/gamePage/components/matchup/matchup";

import { defaultGamePageState, IGamePageState } from "../../pages/gamePage/models/gamePageState";
import { IMatchup } from "../../../stroll-models/matchup";

interface ExampleMatchupProps {  
  matchup: IMatchup;
}

export const ExampleMatchup: React.FC<ExampleMatchupProps> = (props: ExampleMatchupProps) => {    
  const state: IGamePageState = { ...defaultGamePageState(), day: 1 };

  return (    
    <GamePageContext.Provider value={{ state, setState: () => {}}}>
      <div className="example-matchup-wrapper">
        <Matchup matchup={props.matchup} predictions={[]} />
      </div>
    </GamePageContext.Provider>
  )
}